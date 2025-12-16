import { Customer } from "@/types";

export const formatParticipantName = (
  participants: Customer[],
  user_id: string | number,
  with_comma: boolean = true
): string => {
  const participant = participants.find(
    participant => participant.user_id === user_id
  );

  if (!participant) return "";

  const suffix = with_comma ? ", " : ":";
  const username = participant.user?.username;

  if (username) {
    const firstName = username.split(" ")[0];
    return `${firstName} ${suffix}`;
  }

  return `anonymous ${suffix}`;
};