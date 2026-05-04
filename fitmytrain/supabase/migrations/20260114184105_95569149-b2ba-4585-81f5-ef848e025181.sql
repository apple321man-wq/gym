-- =============================================
-- БЛОК 1: Профили пользователей
-- =============================================

-- Enum для пола
CREATE TYPE public.user_gender AS ENUM ('male', 'female');

-- Enum для целей тренировок
CREATE TYPE public.training_goal AS ENUM ('muscle_gain', 'cutting', 'recomposition', 'maintenance');

-- Enum для уровня опыта
CREATE TYPE public.experience_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Таблица профилей пользователей
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender user_gender NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 14 AND age <= 100),
  height NUMERIC(5,1) NOT NULL CHECK (height >= 100 AND height <= 250),
  weight NUMERIC(5,1) NOT NULL CHECK (weight >= 30 AND weight <= 300),
  goal training_goal NOT NULL DEFAULT 'muscle_gain',
  experience experience_level NOT NULL DEFAULT 'beginner',
  weekly_trainings INTEGER NOT NULL DEFAULT 3 CHECK (weekly_trainings >= 2 AND weekly_trainings <= 6),
  selected_days INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS для профилей
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- =============================================
-- БЛОК 2: Тренировочные дни
-- =============================================

CREATE TYPE public.training_intensity AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE public.training_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  intensity training_intensity NOT NULL DEFAULT 'medium',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.training_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training days" 
ON public.training_days FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training days" 
ON public.training_days FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training days" 
ON public.training_days FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training days" 
ON public.training_days FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- БЛОК 3: Запланированные упражнения
-- =============================================

CREATE TABLE public.planned_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_day_id UUID NOT NULL REFERENCES public.training_days(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.planned_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planned exercises" 
ON public.planned_exercises FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.training_days td 
    WHERE td.id = training_day_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own planned exercises" 
ON public.planned_exercises FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.training_days td 
    WHERE td.id = training_day_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own planned exercises" 
ON public.planned_exercises FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.training_days td 
    WHERE td.id = training_day_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own planned exercises" 
ON public.planned_exercises FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.training_days td 
    WHERE td.id = training_day_id AND td.user_id = auth.uid()
  )
);

-- =============================================
-- БЛОК 4: Подходы (sets)
-- =============================================

CREATE TABLE public.exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planned_exercise_id UUID NOT NULL REFERENCES public.planned_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  target_reps INTEGER NOT NULL CHECK (target_reps >= 1 AND target_reps <= 100),
  target_weight NUMERIC(5,1) CHECK (target_weight >= 0 AND target_weight <= 999.9),
  actual_reps INTEGER CHECK (actual_reps >= 0 AND actual_reps <= 100),
  actual_weight NUMERIC(5,1) CHECK (actual_weight >= 0 AND actual_weight <= 999.9),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sets" 
ON public.exercise_sets FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.planned_exercises pe 
    JOIN public.training_days td ON td.id = pe.training_day_id
    WHERE pe.id = planned_exercise_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own sets" 
ON public.exercise_sets FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.planned_exercises pe 
    JOIN public.training_days td ON td.id = pe.training_day_id
    WHERE pe.id = planned_exercise_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own sets" 
ON public.exercise_sets FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.planned_exercises pe 
    JOIN public.training_days td ON td.id = pe.training_day_id
    WHERE pe.id = planned_exercise_id AND td.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own sets" 
ON public.exercise_sets FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.planned_exercises pe 
    JOIN public.training_days td ON td.id = pe.training_day_id
    WHERE pe.id = planned_exercise_id AND td.user_id = auth.uid()
  )
);

-- =============================================
-- БЛОК 5: Персональные максимумы
-- =============================================

CREATE TABLE public.personal_maxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  weight NUMERIC(5,1) NOT NULL CHECK (weight > 0 AND weight <= 999.9),
  reps INTEGER NOT NULL DEFAULT 1 CHECK (reps >= 1 AND reps <= 20),
  estimated_1rm NUMERIC(5,1),
  achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

ALTER TABLE public.personal_maxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own PMs" 
ON public.personal_maxes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PMs" 
ON public.personal_maxes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PMs" 
ON public.personal_maxes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PMs" 
ON public.personal_maxes FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- БЛОК 6: Замеры тела
-- =============================================

CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC(5,1) CHECK (weight >= 30 AND weight <= 300),
  body_fat NUMERIC(4,1) CHECK (body_fat >= 3 AND body_fat <= 60),
  chest NUMERIC(5,1),
  waist NUMERIC(5,1),
  hips NUMERIC(5,1),
  biceps_left NUMERIC(4,1),
  biceps_right NUMERIC(4,1),
  thigh_left NUMERIC(5,1),
  thigh_right NUMERIC(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements" 
ON public.body_measurements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements" 
ON public.body_measurements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements" 
ON public.body_measurements FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements" 
ON public.body_measurements FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- БЛОК 7: Лог весов (история)
-- =============================================

CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  weight NUMERIC(5,1) NOT NULL CHECK (weight > 0 AND weight <= 999.9),
  reps INTEGER NOT NULL CHECK (reps >= 1 AND reps <= 100),
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_weight_logs_user_exercise ON public.weight_logs(user_id, exercise_id, logged_at DESC);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight logs" 
ON public.weight_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" 
ON public.weight_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- БЛОК 8: Триггеры
-- =============================================

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Триггеры для updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_days_updated_at
  BEFORE UPDATE ON public.training_days
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_maxes_updated_at
  BEFORE UPDATE ON public.personal_maxes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Функция расчёта estimated 1RM (формула Epley)
CREATE OR REPLACE FUNCTION public.calculate_estimated_1rm()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reps = 1 THEN
    NEW.estimated_1rm = NEW.weight;
  ELSE
    NEW.estimated_1rm = ROUND((NEW.weight * (1 + NEW.reps::numeric / 30))::numeric, 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER calculate_pm_estimated_1rm
  BEFORE INSERT OR UPDATE ON public.personal_maxes
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_estimated_1rm();