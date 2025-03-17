/*
  # Add Jai Mahal Palace Hotel Data

  1. New Data
    - Add Jai Mahal Palace hotel
    - Add room types:
      - Heritage Room King Bed
      - Deluxe Suite Themed Suites
      - Deluxe Premium Suite
    - Add rooms for each type with amenities

  2. Changes
    - Insert hotel record
    - Insert room types with amenities
    - Insert rooms for each type
*/

DO $$
DECLARE
  hotel_id uuid;
  heritage_type_id uuid;
  deluxe_suite_id uuid;
  premium_suite_id uuid;
BEGIN
  -- Insert Jai Mahal Palace Hotel
  INSERT INTO hotels (
    name,
    description,
    location,
    image_url,
    rating
  ) VALUES (
    'Jai Mahal Palace',
    'Nestled in the heart of the Pink City, situated across 18 acres of meticulously maintained gardens, Jai Mahal Palace in Jaipur stands as a lovingly restored gem of Rajasthani heritage. Built in 1745, this authentic luxury palace offers artful rooms and themed suites.',
    'Jaipur, Rajasthan',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    5
  ) RETURNING id INTO hotel_id;

  -- Heritage Room King Bed
  INSERT INTO room_types (
    name,
    description,
    base_price,
    amenities
  ) VALUES (
    'Heritage Room King Bed',
    'Ensconced in the Heritage Wing of the palace that dates back to 1745 AD these Heritage Rooms are synonymous with timeless luxury, palatial living and royal aesthetics.',
    52650,
    jsonb_build_array(
      'Bathtub', 'Air Conditioning', 'Free Wi-Fi', 'King Bed',
      'Mini Bar', '24-hour Room Service', 'City View', 'Daily Housekeeping'
    )
  ) RETURNING id INTO heritage_type_id;

  -- Deluxe Suite Themed Suites
  INSERT INTO room_types (
    name,
    description,
    base_price,
    amenities
  ) VALUES (
    'Deluxe Suite Themed Suites',
    'With stylish interiors and warm hospitality, this luxury accommodation boasts a comfy living area, a spacious dining area, and elegant floor-to-ceiling windows.',
    109350,
    jsonb_build_array(
      'Living Area', 'Dining Area', 'Bathtub', 'King Bed',
      'Smart TV', 'Mini Bar', 'Garden View', 'Butler Service'
    )
  ) RETURNING id INTO deluxe_suite_id;

  -- Deluxe Premium Suite
  INSERT INTO room_types (
    name,
    description,
    base_price,
    amenities
  ) VALUES (
    'Deluxe Premium Suite',
    'A luxurious experience awaits you in this beautiful suite with a comfy living area, a spacious dining area, and elegant floor-to-ceiling windows.',
    131850,
    jsonb_build_array(
      'Living Area', 'Dining Area', 'Premium Bathtub', 'King Bed',
      'Smart TV', 'Mini Bar', 'Garden View', 'Butler Service',
      'Private Balcony', 'Spa Access'
    )
  ) RETURNING id INTO premium_suite_id;

  -- Insert Rooms for Heritage Type
  FOR i IN 1..22 LOOP
    INSERT INTO rooms (
      hotel_id,
      room_type_id,
      name,
      description,
      capacity,
      price_per_night,
      floor_number,
      room_number,
      amenities
    ) VALUES (
      hotel_id,
      heritage_type_id,
      'Heritage Room ' || i,
      'Heritage Room with King Bed and City View',
      2,
      52650,
      CEIL(i/8::float),
      'H' || LPAD(i::text, 2, '0'),
      (SELECT amenities FROM room_types WHERE id = heritage_type_id)
    );
  END LOOP;

  -- Insert Rooms for Deluxe Suites
  FOR i IN 1..4 LOOP
    INSERT INTO rooms (
      hotel_id,
      room_type_id,
      name,
      description,
      capacity,
      price_per_night,
      floor_number,
      room_number,
      amenities
    ) VALUES (
      hotel_id,
      deluxe_suite_id,
      'Deluxe Suite ' || i,
      'Themed Luxury Suite with Living and Dining Area',
      4,
      109350,
      3,
      'DS' || LPAD(i::text, 2, '0'),
      (SELECT amenities FROM room_types WHERE id = deluxe_suite_id)
    );
  END LOOP;

  -- Insert Rooms for Premium Suites
  FOR i IN 1..2 LOOP
    INSERT INTO rooms (
      hotel_id,
      room_type_id,
      name,
      description,
      capacity,
      price_per_night,
      floor_number,
      room_number,
      amenities
    ) VALUES (
      hotel_id,
      premium_suite_id,
      'Premium Suite ' || i,
      'Ultra Luxury Suite with Premium Amenities',
      4,
      131850,
      3,
      'PS' || LPAD(i::text, 2, '0'),
      (SELECT amenities FROM room_types WHERE id = premium_suite_id)
    );
  END LOOP;
END $$;