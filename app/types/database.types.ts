export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string
          created_at: string
          url: string
          author: string
          likes: number
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          author?: string
          likes?: number
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          author?: string
          likes?: number
        }
      }
    }
  }
}