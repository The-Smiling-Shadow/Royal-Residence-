/*
  # Enhanced Hotel Management System Schema

  1. New Tables
    - `room_types`: Store different types of rooms and their base prices
    - `room_images`: Store multiple images per room
    - `payments`: Track payment information
    - `user_profiles`: Extended user information with role management

  2. Updates
    - Added new columns to rooms table
    - Enhanced bookings table with payment status
    - Added audit timestamps to all tables

  3. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
*/

-- Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL CHECK (base_price >= 0),
  amenities jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;

-- Update Rooms Table
ALTER TABLE rooms 
  ADD COLUMN IF NOT EXISTS room_type_id uuid REFERENCES room_types(id),
  ADD COLUMN IF NOT EXISTS floor_number integer,
  ADD COLUMN IF NOT EXISTS room_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'available' 
    CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  ADD COLUMN IF NOT EXISTS last_cleaned_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '[]'::jsonb;

-- Room Images Table
CREATE TABLE IF NOT EXISTS room_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  caption text
);

ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  full_name text,
  phone_number text,
  address text,
  preferred_language text DEFAULT 'en',
  notifications_enabled boolean DEFAULT true,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  status text DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  payment_date timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Update Bookings Table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS cancellation_date timestamptz,
  ADD COLUMN IF NOT EXISTS special_requests text;

-- Row Level Security Policies

-- Room Types Policies
CREATE POLICY "Room types are viewable by everyone"
  ON room_types FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Room types are manageable by admins only"
  ON room_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Room Images Policies
CREATE POLICY "Room images are viewable by everyone"
  ON room_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Room images are manageable by admins only"
  ON room_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Payments Policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION calculate_room_availability(room_id uuid, check_in date, check_out date)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.room_id = calculate_room_availability.room_id
    AND bookings.status != 'cancelled'
    AND (
      (bookings.check_in_date, bookings.check_out_date) OVERLAPS
      (calculate_room_availability.check_in, calculate_room_availability.check_out)
    )
  );
END;
$$;