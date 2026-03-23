export const MOCK_DRIVERS = [
  { id: '1', name: 'Arjun Sharma', rating: 4.9, trips: 312, initials: 'AS', badge: 'Top Rated', vehicle: 'Honda City · DL 01 AB 1234', eta: '4 min away' },
  { id: '2', name: 'Priya Kapoor', rating: 4.8, trips: 198, initials: 'PK', badge: 'Verified', vehicle: 'Maruti Swift · DL 05 CD 5678', eta: '7 min away' },
  { id: '3', name: 'Rahul Mehta', rating: 4.7, trips: 445, initials: 'RM', badge: 'Expert', vehicle: 'Hyundai i20 · DL 12 EF 9012', eta: '11 min away' },
]

export const MOCK_TRIPS_USER = [
  { id: 'B001', date: 'Mar 21, 2026', pickup: 'Connaught Place', drop: 'Saket District Centre', driver: 'Arjun Sharma', fare: '₹320', status: 'completed' },
  { id: 'B002', date: 'Mar 18, 2026', pickup: 'Lajpat Nagar', drop: 'IGI Airport T3', driver: 'Priya Kapoor', fare: '₹680', status: 'completed' },
  { id: 'B003', date: 'Mar 15, 2026', pickup: 'Dwarka Sec 12', drop: 'Nehru Place', driver: 'Rahul Mehta', fare: '₹420', status: 'completed' },
  { id: 'B004', date: 'Mar 10, 2026', pickup: 'Vasant Kunj', drop: 'Gurgaon Cyber Hub', driver: 'Arjun Sharma', fare: '₹550', status: 'cancelled' },
]

export const MOCK_JOBS_DRIVER = [
  { id: 'J001', user: 'Kavya R.', pickup: 'Hauz Khas Village', drop: 'Noida Sec 18', dist: '22 km', fare: '₹480', reason: 'Fatigue', urgent: true },
  { id: 'J002', user: 'Mohan D.', pickup: 'Rohini Sec 10', drop: 'Connaught Place', dist: '18 km', fare: '₹380', reason: 'Medical', urgent: false },
  { id: 'J003', user: 'Sita P.', pickup: 'Greater Kailash', drop: 'IGI Airport', dist: '15 km', fare: '₹640', reason: 'Late Night', urgent: false },
]

export const REASONS = [
  'Fatigue / Drowsiness', 'Medical Condition', 'Alcohol Consumption',
  'Stress / Anxiety', 'Emergency Situation', 'Post-Surgery Recovery',
  'Long Distance Travel', 'Other',
]

export const SCHEMA_SQL = `-- Run this in your Supabase SQL Editor --

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('user','driver')) NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_color TEXT,
  vehicle_plate TEXT,
  is_available BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  current_lat NUMERIC(10,6),
  current_lng NUMERIC(10,6)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  driver_id UUID REFERENCES profiles(id),
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_lat NUMERIC(10,6),
  pickup_lng NUMERIC(10,6),
  dropoff_lat NUMERIC(10,6),
  dropoff_lng NUMERIC(10,6),
  status TEXT CHECK (status IN ('pending','accepted','in_progress','completed','cancelled')) DEFAULT 'pending',
  estimated_fare NUMERIC(8,2),
  final_fare NUMERIC(8,2),
  reason TEXT,
  notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  rated_by UUID REFERENCES profiles(id) NOT NULL,
  rated_user UUID REFERENCES profiles(id) NOT NULL,
  score INTEGER CHECK (score BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public drivers" ON drivers FOR SELECT USING (true);
CREATE POLICY "Own driver update" ON drivers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insert own driver" ON drivers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "User bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = driver_id);
CREATE POLICY "Create booking" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update booking" ON bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = driver_id);
CREATE POLICY "View ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Create rating" ON ratings FOR INSERT WITH CHECK (auth.uid() = rated_by);`
