/*
  # Initial Schema for Hotel Booking System

  1. New Tables
    - hotels
      - Basic hotel information including name, description, location
    - rooms
      - Room details including type, capacity, price
    - bookings
      - Booking records linking users, rooms, and dates
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  image_url text,
  rating smallint CHECK (rating >= 1 AND rating <= 5),
  user_id uuid REFERENCES auth.users(id)
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  capacity int NOT NULL,
  price_per_night decimal NOT NULL,
  is_available boolean DEFAULT true
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  room_id uuid REFERENCES rooms(id),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  total_price decimal NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for hotels
CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Hotels are insertable by authenticated users"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hotels are updatable by owners"
  ON hotels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for rooms
CREATE POLICY "Rooms are viewable by everyone"
  ON rooms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Rooms are manageable by hotel owners"
  ON rooms FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM hotels
    WHERE hotels.id = rooms.hotel_id
    AND hotels.user_id = auth.uid()
  ));

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);