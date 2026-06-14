export type TripStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type VehicleStatus = "active" | "maintenance" | "inactive" | "decommissioned";
export type IncidentType = "breakdown" | "accident" | "off_route" | "delay" | "fuel_issue" | "other";
export type MaintenanceType = "scheduled" | "emergency" | "inspection";

export interface Trip {
  id: string;
  trip_ref: string;
  vehicle_id: string;
  driver_id: string;
  organization_id: string;
  origin: string;
  destination: string;
  purpose?: string;
  status: TripStatus;
  planned_departure: string;
  planned_arrival?: string;
  actual_departure?: string;
  actual_arrival?: string;
  distance_km?: number;
  fuel_used_liters?: number;
  cargo_description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  incidents?: TripIncident[];
}

export interface Vehicle {
  id: string;
  reg_number: string;
  make: string;
  model: string;
  year: number;
  capacity_liters: number;
  fuel_type: string;
  status: VehicleStatus;
  driver_id?: string;
  organization_id: string;
  license_expiry: string;
  insurance_expiry?: string;
  next_service_date?: string;
  next_service_km?: number;
  current_mileage?: number;
}

export interface TripIncident {
  id: string;
  trip_id: string;
  incident_type: IncidentType;
  description: string;
  occurred_at: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  resolved_at?: string;
  reported_by: string;
}

export interface DriverStats {
  driver_id: string;
  organization_id: string;
  trip_summary: {
    total_assigned: number;
    completed: number;
    cancelled: number;
    in_progress: number;
    completion_rate: string;
  };
  performance: {
    on_time_arrivals: number;
    late_arrivals: number;
    on_time_rate: string;
    total_incidents: number;
  };
  mileage: {
    total_distance_km: string;
    total_fuel_liters: string;
    avg_fuel_per_100km: string | null;
  };
  current_trip_id?: string;
  last_trip_at?: string | null;
  last_location?: {
    latitude: string;
    longitude: string;
    recorded_at: string;
  };
  updated_at: string;
}

export interface ScheduleTripInput {
  vehicle_id: string;
  driver_id: string;
  organization_id: string;
  origin: string;
  destination: string;
  purpose?: string;
  planned_departure: string;
  planned_arrival?: string;
  distance_km?: number;
  cargo_description?: string;
  notes?: string;
}

export interface UpdateTripStatusInput {
  status: TripStatus;
  distance_km?: number;
  fuel_used_liters?: number;
  notes?: string;
}

export interface ReportIncidentInput {
  incident_type: IncidentType;
  description: string;
  occurred_at: string;
  reported_by: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  resolved_at?: string;
}

export interface PaginatedTrips {
  data: Trip[];
  total: number;
  page: number;
  limit: number;
}
