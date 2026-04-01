import {
  parseCS2Stats,
  formatKD,
  formatPercent,
  formatPlaytime,
} from "@/lib/cs2"
import { getCS2Stats, getOwnedGames, getPlayerSummaries } from "@/lib/steam"
import { CS2_APP_ID } from "@/lib/steam-types"
import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ steamid: string }> }
) {
  const { steamid } = await params

  const [summaries, rawStats, ownedGames] = await Promise.all([
    getPlayerSummaries([steamid]),
    getCS2Stats(steamid),
    getOwnedGames(steamid),
  ])

  const player = summaries[0]
  if (!player || !rawStats) {
    return new Response("Player not found", { status: 404 })
  }

  const cs2Game = ownedGames?.find((g) => g.appid === CS2_APP_ID)
  const stats = parseCS2Stats(rawStats, steamid, cs2Game?.playtime_forever)
  const topWeapon = stats.weapons[0]

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white",
        padding: "48px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={player.avatarfull}
          alt=""
          width={80}
          height={80}
          style={{
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.2)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold" }}>
            {player.personaname}
          </span>
          <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)" }}>
            CS2 Stats
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          flex: 1,
        }}
      >
        <StatBox label="K/D Ratio" value={formatKD(stats.kdRatio)} highlight />
        <StatBox
          label="Headshot %"
          value={formatPercent(stats.headshotPercentage)}
          highlight
        />
        <StatBox
          label="Total Kills"
          value={stats.totalKills.toLocaleString()}
        />
        <StatBox label="Total Wins" value={stats.totalWins.toLocaleString()} />
        <StatBox label="MVP Stars" value={stats.totalMvps.toLocaleString()} />
        <StatBox
          label="Playtime"
          value={formatPlaytime(stats.totalTimePlayed)}
        />
        {topWeapon && <StatBox label="Fav. Weapon" value={topWeapon.weapon} />}
      </div>

      {/* Branding */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
          Steam Stats
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: highlight
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "16px 24px",
        minWidth: "160px",
        border: highlight
          ? "1px solid rgba(99, 102, 241, 0.4)"
          : "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.5)",
          marginBottom: "4px",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</span>
    </div>
  )
}
