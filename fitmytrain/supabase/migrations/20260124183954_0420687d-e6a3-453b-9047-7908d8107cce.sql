-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS injuries text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS priority_muscles text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS equipment text[] NOT NULL DEFAULT ARRAY['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight'];

-- Create enum for equipment types
DO $$ BEGIN
    CREATE TYPE equipment_type AS ENUM (
        'barbell',
        'dumbbells', 
        'machines',
        'cables',
        'bodyweight',
        'kettlebell',
        'bands'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for injury areas
DO $$ BEGIN
    CREATE TYPE injury_area AS ENUM (
        'knee',
        'shoulder',
        'lower_back',
        'elbow',
        'wrist',
        'hip',
        'ankle',
        'neck'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;