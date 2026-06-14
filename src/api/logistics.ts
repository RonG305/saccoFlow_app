import { BASE_URLS } from "./base";
import { makeApiRequest } from "./main";
import type {
  ScheduleTripInput,
  UpdateTripStatusInput,
  ReportIncidentInput,
} from "@/types/logistics";

const BASE = BASE_URLS.LOGISTICS_URL;

export const getTrips = async (params: Record<string, string | number> = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
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

export const updateTripStatus = async (id: string, data: UpdateTripStatusInput) => {
  const response = await makeApiRequest(BASE, `/trips/${id}/status`, {
    method: "PATCH",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const reportIncident = async (tripId: string, data: ReportIncidentInput) => {
  const response = await makeApiRequest(BASE, `/trips/${tripId}/incidents`, {
    method: "POST",
    withToken: true,
    body: data,
  });
  return response?.json();
};

export const getVehicles = async (params: Record<string, string | number> = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  const response = await makeApiRequest(BASE, `/vehicles${qs ? `?${qs}` : ""}`, {
    method: "GET",
    withToken: true,
  });
  return response?.json();
};
