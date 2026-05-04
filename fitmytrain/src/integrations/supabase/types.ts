export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      body_measurements: {
        Row: {
          biceps_left: number | null
          biceps_right: number | null
          body_fat: number | null
          chest: number | null
          created_at: string
          hips: number | null
          id: string
          measured_at: string
          notes: string | null
          thigh_left: number | null
          thigh_right: number | null
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          biceps_left?: number | null
          biceps_right?: number | null
          body_fat?: number | null
          chest?: number | null
          created_at?: string
          hips?: number | null
          id?: string
          measured_at?: string
          notes?: string | null
          thigh_left?: number | null
          thigh_right?: number | null
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          biceps_left?: number | null
          biceps_right?: number | null
          body_fat?: number | null
          chest?: number | null
          created_at?: string
          hips?: number | null
          id?: string
          measured_at?: string
          notes?: string | null
          thigh_left?: number | null
          thigh_right?: number | null
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      exercise_sets: {
        Row: {
          actual_reps: number | null
          actual_weight: number | null
          created_at: string
          id: string
          is_completed: boolean
          planned_exercise_id: string
          rir: number | null
          set_number: number
          target_reps: number
          target_weight: number | null
        }
        Insert: {
          actual_reps?: number | null
          actual_weight?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean
          planned_exercise_id: string
          rir?: number | null
          set_number: number
          target_reps: number
          target_weight?: number | null
        }
        Update: {
          actual_reps?: number | null
          actual_weight?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean
          planned_exercise_id?: string
          rir?: number | null
          set_number?: number
          target_reps?: number
          target_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_planned_exercise_id_fkey"
            columns: ["planned_exercise_id"]
            isOneToOne: false
            referencedRelation: "planned_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_maxes: {
        Row: {
          achieved_at: string
          created_at: string
          estimated_1rm: number | null
          exercise_id: string
          id: string
          reps: number
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          achieved_at?: string
          created_at?: string
          estimated_1rm?: number | null
          exercise_id: string
          id?: string
          reps?: number
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          achieved_at?: string
          created_at?: string
          estimated_1rm?: number | null
          exercise_id?: string
          id?: string
          reps?: number
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      planned_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          exercise_name: string
          id: string
          order_index: number
          training_day_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          exercise_name: string
          id?: string
          order_index?: number
          training_day_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          exercise_name?: string
          id?: string
          order_index?: number
          training_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_exercises_training_day_id_fkey"
            columns: ["training_day_id"]
            isOneToOne: false
            referencedRelation: "training_days"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_update_log: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          new_1rm: number
          old_1rm: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          new_1rm: number
          old_1rm: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          new_1rm?: number
          old_1rm?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          created_at: string
          equipment: string[]
          experience: Database["public"]["Enums"]["experience_level"]
          gender: Database["public"]["Enums"]["user_gender"]
          goal: Database["public"]["Enums"]["training_goal"]
          height: number
          id: string
          injuries: string[]
          name: string
          onboarding_completed: boolean
          priority_muscles: string[]
          selected_days: number[]
          updated_at: string
          user_id: string
          weekly_trainings: number
          weight: number
        }
        Insert: {
          age: number
          created_at?: string
          equipment?: string[]
          experience?: Database["public"]["Enums"]["experience_level"]
          gender: Database["public"]["Enums"]["user_gender"]
          goal?: Database["public"]["Enums"]["training_goal"]
          height: number
          id?: string
          injuries?: string[]
          name: string
          onboarding_completed?: boolean
          priority_muscles?: string[]
          selected_days?: number[]
          updated_at?: string
          user_id: string
          weekly_trainings?: number
          weight: number
        }
        Update: {
          age?: number
          created_at?: string
          equipment?: string[]
          experience?: Database["public"]["Enums"]["experience_level"]
          gender?: Database["public"]["Enums"]["user_gender"]
          goal?: Database["public"]["Enums"]["training_goal"]
          height?: number
          id?: string
          injuries?: string[]
          name?: string
          onboarding_completed?: boolean
          priority_muscles?: string[]
          selected_days?: number[]
          updated_at?: string
          user_id?: string
          weekly_trainings?: number
          weight?: number
        }
        Relationships: []
      }
      training_days: {
        Row: {
          completed_at: string | null
          created_at: string
          date: string
          id: string
          intensity: Database["public"]["Enums"]["training_intensity"]
          is_completed: boolean
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          date: string
          id?: string
          intensity?: Database["public"]["Enums"]["training_intensity"]
          is_completed?: boolean
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          intensity?: Database["public"]["Enums"]["training_intensity"]
          is_completed?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_modifications: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          modification_type: string
          new_exercise_id: string | null
          new_exercise_name: string | null
          new_sets_count: number | null
          new_weight: number | null
          order_index: number | null
          original_exercise_id: string | null
          target_reps: number | null
          training_day_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          modification_type: string
          new_exercise_id?: string | null
          new_exercise_name?: string | null
          new_sets_count?: number | null
          new_weight?: number | null
          order_index?: number | null
          original_exercise_id?: string | null
          target_reps?: number | null
          training_day_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          modification_type?: string
          new_exercise_id?: string | null
          new_exercise_name?: string | null
          new_sets_count?: number | null
          new_weight?: number | null
          order_index?: number | null
          original_exercise_id?: string | null
          target_reps?: number | null
          training_day_name?: string
          user_id?: string
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          is_confirmed: boolean
          logged_at: string
          reps: number
          rir: number | null
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          is_confirmed?: boolean
          logged_at?: string
          reps: number
          rir?: number | null
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          is_confirmed?: boolean
          logged_at?: string
          reps?: number
          rir?: number | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      equipment_type:
        | "barbell"
        | "dumbbells"
        | "machines"
        | "cables"
        | "bodyweight"
        | "kettlebell"
        | "bands"
      experience_level: "beginner" | "intermediate" | "advanced"
      injury_area:
        | "knee"
        | "shoulder"
        | "lower_back"
        | "elbow"
        | "wrist"
        | "hip"
        | "ankle"
        | "neck"
      training_goal: "muscle_gain" | "cutting" | "recomposition" | "maintenance"
      training_intensity: "easy" | "medium" | "hard"
      user_gender: "male" | "female"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      equipment_type: [
        "barbell",
        "dumbbells",
        "machines",
        "cables",
        "bodyweight",
        "kettlebell",
        "bands",
      ],
      experience_level: ["beginner", "intermediate", "advanced"],
      injury_area: [
        "knee",
        "shoulder",
        "lower_back",
        "elbow",
        "wrist",
        "hip",
        "ankle",
        "neck",
      ],
      training_goal: ["muscle_gain", "cutting", "recomposition", "maintenance"],
      training_intensity: ["easy", "medium", "hard"],
      user_gender: ["male", "female"],
    },
  },
} as const
