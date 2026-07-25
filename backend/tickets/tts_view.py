from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from google.cloud import texttospeech


class AnnouncementAudioView(APIView):
    def post(self, request):
        ticket_number = request.data.get('ticket_number')

        if ticket_number is None or ticket_number.strip() == '':
            return Response(
                {"error": "ticket_number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        announcement_text = "Ticket " + ticket_number + ", please proceed to the counter."

        try:
            client = texttospeech.TextToSpeechClient()

            synthesis_input = texttospeech.SynthesisInput(text=announcement_text)

            voice = texttospeech.VoiceSelectionParams(
                language_code="en-US",
                name="en-US-Wavenet-D",
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )

            response = client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config,
            )

            return HttpResponse(response.audio_content, content_type="audio/mpeg")

        except Exception as error:
            return Response(
                {"error": "Could not generate audio.", "details": str(error)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )