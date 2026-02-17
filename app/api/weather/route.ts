import { NextResponse } from "next/server";

function mapWeatherCode(code: number): { emoji: string; condition: string } {
  if (code === 0) return { emoji: "☀️", condition: "Clear" };
  if (code <= 3) return { emoji: "⛅", condition: "Partly Cloudy" };
  if (code <= 48) return { emoji: "🌫️", condition: "Foggy" };
  if (code <= 67) return { emoji: "🌧️", condition: "Rainy" };
  if (code <= 77) return { emoji: "❄️", condition: "Snowy" };
  if (code <= 82) return { emoji: "🌦️", condition: "Showers" };
  if (code === 95) return { emoji: "⛈️", condition: "Thunderstorm" };
  return { emoji: "🌤️", condition: "Unknown" };
}

export async function GET() {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=34.0522&longitude=-118.2437" +
      "&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m" +
      "&daily=temperature_2m_max,temperature_2m_min" +
      "&temperature_unit=fahrenheit" +
      "&forecast_days=1" +
      "&timezone=America/Los_Angeles";

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const { emoji, condition } = mapWeatherCode(current.weathercode);

    return NextResponse.json({
      temp: Math.round(current.temperature_2m),
      condition,
      emoji,
      high: Math.round(daily.temperature_2m_max[0]),
      low: Math.round(daily.temperature_2m_min[0]),
      humidity: current.relativehumidity_2m,
      windspeed: Math.round(current.windspeed_10m),
      location: "Los Angeles, CA",
    });
  } catch (err) {
    console.error("[weather route]", err);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
