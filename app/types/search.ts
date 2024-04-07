import { StudyRoom, Reservation } from "@prisma/client";

export interface SearchResult {
  studyroom: StudyRoom;
  reservations: Reservation[];
}
