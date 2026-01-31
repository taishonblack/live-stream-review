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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_inputs: {
        Row: {
          created_at: string
          enabled: boolean
          host: string | null
          id: string
          latency_ms: number | null
          mode: Database["public"]["Enums"]["srt_mode"]
          name: string
          passphrase: string | null
          port: number | null
          position: number
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          host?: string | null
          id?: string
          latency_ms?: number | null
          mode?: Database["public"]["Enums"]["srt_mode"]
          name: string
          passphrase?: string | null
          port?: number | null
          position: number
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          host?: string | null
          id?: string
          latency_ms?: number | null
          mode?: Database["public"]["Enums"]["srt_mode"]
          name?: string
          passphrase?: string | null
          port?: number | null
          position?: number
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_inputs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_invites: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          max_uses: number | null
          role: Database["public"]["Enums"]["app_role"]
          session_id: string
          token: string
          use_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          session_id: string
          token?: string
          use_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          session_id?: string
          token?: string
          use_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_invites_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_markers: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          input_id: string | null
          label: string
          note: string | null
          session_id: string
          severity: Database["public"]["Enums"]["stream_health"]
          timestamp_ms: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          input_id?: string | null
          label: string
          note?: string | null
          session_id: string
          severity?: Database["public"]["Enums"]["stream_health"]
          timestamp_ms: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          input_id?: string | null
          label?: string
          note?: string | null
          session_id?: string
          severity?: Database["public"]["Enums"]["stream_health"]
          timestamp_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_markers_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "session_inputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_markers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["app_role"]
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_members_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content: string
          id: string
          session_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string
          id?: string
          session_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          session_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_streams: {
        Row: {
          created_at: string
          health: Database["public"]["Enums"]["stream_health"]
          id: string
          input_id: string
          updated_at: string
          webrtc_url: string | null
        }
        Insert: {
          created_at?: string
          health?: Database["public"]["Enums"]["stream_health"]
          id?: string
          input_id: string
          updated_at?: string
          webrtc_url?: string | null
        }
        Update: {
          created_at?: string
          health?: Database["public"]["Enums"]["stream_health"]
          id?: string
          input_id?: string
          updated_at?: string
          webrtc_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_streams_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: true
            referencedRelation: "session_inputs"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          owner_id: string
          purpose: string
          started_at: string | null
          status: Database["public"]["Enums"]["session_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          owner_id: string
          purpose?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          owner_id?: string
          purpose?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stream_metrics_latest: {
        Row: {
          audio_channels: string | null
          audio_lufs_i: number | null
          audio_lufs_m: number | null
          audio_lufs_s: number | null
          audio_peak_db: number | null
          audio_sample_rate: number | null
          audio_true_peak_db: number | null
          id: string
          input_id: string
          network_jitter_ms: number | null
          network_packet_loss: number | null
          network_retransmits: number | null
          network_rtt_ms: number | null
          updated_at: string
          video_bitrate_kbps: number | null
          video_codec: string | null
          video_fps: number | null
          video_resolution: string | null
        }
        Insert: {
          audio_channels?: string | null
          audio_lufs_i?: number | null
          audio_lufs_m?: number | null
          audio_lufs_s?: number | null
          audio_peak_db?: number | null
          audio_sample_rate?: number | null
          audio_true_peak_db?: number | null
          id?: string
          input_id: string
          network_jitter_ms?: number | null
          network_packet_loss?: number | null
          network_retransmits?: number | null
          network_rtt_ms?: number | null
          updated_at?: string
          video_bitrate_kbps?: number | null
          video_codec?: string | null
          video_fps?: number | null
          video_resolution?: string | null
        }
        Update: {
          audio_channels?: string | null
          audio_lufs_i?: number | null
          audio_lufs_m?: number | null
          audio_lufs_s?: number | null
          audio_peak_db?: number | null
          audio_sample_rate?: number | null
          audio_true_peak_db?: number | null
          id?: string
          input_id?: string
          network_jitter_ms?: number | null
          network_packet_loss?: number | null
          network_retransmits?: number | null
          network_rtt_ms?: number | null
          updated_at?: string
          video_bitrate_kbps?: number | null
          video_codec?: string | null
          video_fps?: number | null
          video_resolution?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_metrics_latest_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: true
            referencedRelation: "session_inputs"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_metrics_points: {
        Row: {
          bitrate_kbps: number | null
          id: string
          input_id: string
          lufs_m: number | null
          packet_loss: number | null
          rtt_ms: number | null
          timestamp: string
        }
        Insert: {
          bitrate_kbps?: number | null
          id?: string
          input_id: string
          lufs_m?: number | null
          packet_loss?: number | null
          rtt_ms?: number | null
          timestamp?: string
        }
        Update: {
          bitrate_kbps?: number | null
          id?: string
          input_id?: string
          lufs_m?: number | null
          packet_loss?: number | null
          rtt_ms?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_metrics_points_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "session_inputs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_session_role: {
        Args: { _session_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_session_member: {
        Args: { _session_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "commenter" | "viewer"
      session_status: "draft" | "live" | "ended"
      srt_mode: "caller" | "listener"
      stream_health: "ok" | "warning" | "error" | "off"
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
      app_role: ["owner", "commenter", "viewer"],
      session_status: ["draft", "live", "ended"],
      srt_mode: ["caller", "listener"],
      stream_health: ["ok", "warning", "error", "off"],
    },
  },
} as const
