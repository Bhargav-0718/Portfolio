import { Arrival } from "@/components/lobby/Arrival";
import { NowShowing } from "@/components/lobby/NowShowing";
import { OffTheClock } from "@/components/lobby/OffTheClock";
import { RecordRoomGlimpse } from "@/components/lobby/RecordRoomGlimpse";
import { VisitorBrief } from "@/components/lobby/VisitorBrief";
import { Room } from "@/components/rooms/Room";

/** Room 00 — The Lobby. */
export default function LobbyPage() {
  return (
    <Room id="lobby">
      <Arrival />
      <VisitorBrief />
      <NowShowing />
      <RecordRoomGlimpse />
      <OffTheClock />
    </Room>
  );
}
