import { site } from "@/config/site";
import { Room } from "@/components/rooms/Room";
import { getRoom } from "@/lib/rooms";
import { getExhibitVersions } from "@/lib/resumes";
import { RecordRoomScene } from "./RecordRoomScene";

/** Room 06: the résumé, framed and hung. Shared by /resume and /resume/<id>. */
export function RecordRoom({ activeId }: { activeId: string }) {
  const room = getRoom("record");
  return (
    <Room id="record">
      <RecordRoomScene
        versions={getExhibitVersions(activeId)}
        initialId={activeId}
        ownerName={site.name}
        roomIndex={room.index}
        roomName={room.name}
      />
    </Room>
  );
}
