import apiClient from "./api";

export async function playTicketAnnouncement(ticketNumber) {
  try {
    const response = await apiClient.post(
      "/announcement-audio/",
      { ticket_number: ticketNumber },
      { responseType: "blob" }
    );

    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

    return true;
  } catch (error) {
    return false;
  }
}