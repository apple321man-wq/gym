

## Фикс автоподстановки веса для bodyweight/опциональных упражнений (ab-wheel)

### Диагноз

Разметка (`allowsExternalWeight: true` для ab-wheel, russian-twist, hanging/lying-leg-raise, pallof-press, ab-wheel в `exercises.ts`) — **корректна**. Нормализация в `getExerciseById` пробрасывает оба флага — **корректна**. `handleAddExercise` уже использует `shouldAutofillWeight` — **корректен**.

**Реальная причина бага** — в гидрации существующего плана, `TrainingDayView.tsx`, строки 159-208 (внутри `useEffect` инициализации):

```ts
const pm = getPersonalMax(pe.exercise_id);
if (pm && intensity !== 'rest') {
  calculatedWeight = calculateWeightFromPM(pe.exercise_id, pm.estimated_1rm || 0, multiplier, ...);
}
...
targetWeight: shouldRecalculate ? calculatedWeight : (s.target_weight ?? null),
```

`calculateWeightFromPM` для упражнений без коэффициента (ab-wheel и т.п.) идёт в ветку `if (!coef) return Math.round((pm * intensity) / 2.5) * 2.5` и возвращает «силовой» вес. Хранящийся в БД `target_weight = null` перетирается этим значением — поле в UI заполняется автоматически.

Дополнительно та же проблема может прилететь из модификаций `change_weight` (строки 274-301) — на bw-only/optional упражнении изменение веса не должно применяться.

### Файлы и изменения

#### 1. `src/components/TrainingDayView.tsx` — гидрация (строки 159-208)

Перед расчётом `calculatedWeight` подтянуть флаги упражнения и заблокировать пересчёт для bw-only/optional:

```ts
let mapped: LocalExercise[] = existingDay.planned_exercises.map((pe, index) => {
  const exInfo = getExerciseById(pe.exercise_id);
  const isBodyweightOnly = exInfo?.isBodyweightOnly ?? false;
  const allowsExternalWeight = exInfo?.allowsExternalWeight === true;
  const shouldAutofillWeight = !isBodyweightOnly && !allowsExternalWeight;

  const pm = getPersonalMax(pe.exercise_id);
  let calculatedWeight: number | null = null;
  let calculatedReps: number | null = null;

  if (shouldAutofillWeight && pm && intensity !== 'rest') {
    const intensityRanges = { easy: 0.675, medium: 0.75, hard: 0.825 };
    const multiplier = intensityRanges[intensity];
    calculatedWeight = calculateWeightFromPM(
      pe.exercise_id, pm.estimated_1rm || 0, multiplier,
      profile?.weight, pm.weight, pm.reps,
    );
    if (profile?.weight) {
      calculatedReps = calculateBodyweightReps(pe.exercise_id, pm.weight, pm.reps, profile.weight, intensity);
    }
  }
  // ... дальше без изменений: формирование sets с targetWeight: shouldRecalculate ? calculatedWeight : (s.target_weight ?? null)
});
```

Дополнительно — санитайз: для `allowsExternalWeight` и `isBodyweightOnly` принудительно сбросить `targetWeight` к `null`, если из БД пришёл `0` или артефакт прежней автоподстановки:

```ts
const sanitizedWeight = (isBodyweightOnly || allowsExternalWeight)
  ? (isValidWeight(s.target_weight) ? s.target_weight : null)
  : (shouldRecalculate ? calculatedWeight : (s.target_weight ?? null));

return {
  ...,
  targetWeight: sanitizedWeight,
  ...
};
```

Это закрывает кейс, когда у пользователя в плане уже сохранён 0 или автоподставленный вес от прошлой версии.

#### 2. `src/components/TrainingDayView.tsx` — модификация `change_weight` (строки 274-301)

В начале кейса добавить guard — для bw-only/optional модификация веса игнорируется (вес остаётся `null`/как был):

```ts
case 'change_weight':
  if (mod.new_weight !== null) {
    mapped = mapped.map(e => {
      const matchesBySlot = mod.order_index !== null && e.slotIndex === mod.order_index;
      const matchesByExercise = mod.original_exercise_id && e.exerciseId === mod.original_exercise_id;
      if (!matchesBySlot && !matchesByExercise) return e;

      const exInfo = getExerciseById(e.exerciseId);
      if (exInfo?.isBodyweightOnly || exInfo?.allowsExternalWeight === true) {
        return e; // не применяем вес к bw-only/optional
      }

      // ... существующая логика scale by intensity ...
    });
  }
  break;
```

#### 3. Без изменений (уже корректно)

- `src/data/exercises.ts` — флаги выставлены, `getExerciseById` пробрасывает оба поля.
- `src/data/exercisesExtended.ts` — `NormalizedExercise` несёт оба флага, ab-wheel помечен.
- `handleAddExercise` (строки 339-415) — уже использует `shouldAutofillWeight`, инициализирует `targetWeight: workingWeight` (`number | null`) без `?? 0`.
- UI ввода веса, валидация (`handleWeightChange` / `handleWeightBlur`), helper `formatWeight`/`isValidWeight` — без изменений.
- Save в БД (строки 920, 1030) — уже фильтрует через `isValidWeight(...) ? ... : null`.

### Проверка после фикса (тест-кейсы из ТЗ)

| Кейс | Ожидание |
|------|----------|
| Открыть существующий план, где есть ab-wheel | Поле веса пустое (`—`), без автоподстановки |
| Добавить ab-wheel вручную | `targetWeight = null`, поле пустое |
| Ввести вес вручную и закрыть/открыть день | Вес сохраняется и отображается |
| Удалить ab-wheel и добавить заново | Поле снова пустое |
| `change_weight`-модификация на ab-wheel | Игнорируется, поле остаётся пустым |
| bench-press, squat и пр. | Автоподстановка работает как раньше |

### Объём

| Что | Файл | Объём |
|-----|------|-------|
| Guard в гидрации + sanitize веса | `TrainingDayView.tsx` (159-208) | ~10 строк |
| Guard в `change_weight` | `TrainingDayView.tsx` (274-301) | ~5 строк |

Всё. Никаких изменений в данных, инпуте, аналитике, save, sort, PM, assisted/time-based.

