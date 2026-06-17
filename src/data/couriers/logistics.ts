import { BASE_URLS } from "../../api/base";
import { makeApiRequest } from "../../api/main";
import { getCurrentPosition } from "@/lib/geolocation";
import type {
  ScheduleTripInput,
  UpdateTripStatusInput,
  ReportIncidentInput,
  PushLocationInput,
} from "@/types/logistics";

const BASE = BASE_URLS.LOGISTICS_URL;

export const getTrips = async (
  params: Record<string, string | number> = {},
) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const response = await makeApiRequest(BASE, `/trips${qs ? `?${qs}` : ""}`, {
    method: "GET",
    withToken: true,
  });
  return response?.json();
};

export const getTripById = async (id: string) => {
  const response = await makeApiRequest(BASE, `/trips/${id}`, {
    method: "GET",
    withToken: true,
  });
  return response?.json();
};

export const getDriverStats = async (driverId: string) => {
  const response = await makeApiRequest(BASE, `/drivers/${driverId}/stats`, {
    method: "GET",
    withToken: true,
  });
  return response?.json();
};

export const scheduleTrip = async (data: ScheduleTripInput) => {
  const response = await makeApiRequest(BASE, `/trips`, {
    method: "POST",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const updateTripStatus = async (
  id: string,
  data: UpdateTripStatusInput,
) => {
  const response = await makeApiRequest(BASE, `/trips/${id}/status`, {
    method: "PATCH",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const reportIncident = async (
  tripId: string,
  data: ReportIncidentInput,
) => {
  const response = await makeApiRequest(BASE, `/trips/${tripId}/incidents`, {
    method: "POST",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const getVehicles = async (
  params: Record<string, string | number> = {},
) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const response = await makeApiRequest(
    BASE,
    `/vehicles${qs ? `?${qs}` : ""}`,
    {
      method: "GET",
      withToken: true,
    },
  );
  return response?.json();
};

export const pushLocation = async (
  tripId: string,
  extras?: Omit<PushLocationInput, "latitude" | "longitude">,
) => {
  const pos = await getCurrentPosition();

  const data: PushLocationInput = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy_m: pos.coords.accuracy ?? undefined,
    recorded_at: new Date(pos.timestamp).toISOString(),
    ...extras,
  };

  const response = await makeApiRequest(BASE, `/trips/${tripId}/location`, {
    method: "POST",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const getLocationHistory = async (tripId: string) => {
  const response = await makeApiRequest(
    BASE,
    `/trips/${tripId}/location/history`,
    {
      method: "GET",
      withToken: true,
    },
  );
  return response?.json();
};

export const getCurrentLocation = async (tripId: string) => {
  const response = await makeApiRequest(
    BASE,
    `/trips/${tripId}/location/current`,
    {
      method: "GET",
      withToken: true,
    },
  );
  return response?.json();
};
