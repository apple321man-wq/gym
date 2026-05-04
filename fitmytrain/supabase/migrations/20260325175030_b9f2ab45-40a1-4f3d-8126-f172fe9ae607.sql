
ALTER TABLE profiles ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
ALTER TABLE exercise_sets ADD COLUMN rir integer;
ALTER TABLE weight_logs ADD COLUMN rir integer;

CREATE TABLE pm_update_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  exercise_id text NOT NULL,
  old_1rm numeric NOT NULL,
  new_1rm numeric NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE pm_update_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pm update logs" ON pm_update_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pm update logs" ON pm_update_log FOR INSERT WITH CHECK (auth.uid() = user_id);
