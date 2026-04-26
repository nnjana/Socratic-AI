# services/audio_service.py
import librosa
import numpy as np
import io

def extract_hesitation_metrics(audio_bytes: bytes):
    """
    Analyzes audio bytes to calculate a hesitation index based on pauses and speech rate.
    """
    try:
        # Load the audio data into librosa from memory bytes
        y, sr = librosa.load(io.BytesIO(audio_bytes), sr=None)
        
        # --- MACHINE LEARNING: HESITATION EXTRACTION ---
        
        # Metric A: Calculate Total Audio Duration (in seconds)
        total_duration = librosa.get_duration(y=y, sr=sr)
        
        # Metric B: Detect Speech vs. Silence (Pauses)
        non_silent_intervals = librosa.effects.split(y, top_db=30)
        speaking_duration = sum((interval[1] - interval[0]) / sr for interval in non_silent_intervals)
        pause_duration = total_duration - speaking_duration
        
        # Calculate the Pause Ratio (0.0 to 1.0)
        pause_ratio = pause_duration / total_duration if total_duration > 0 else 0
        
        # Metric C: Estimate Speech Rate (Tempo)
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
        estimated_tempo = float(tempo[0]) if isinstance(tempo, np.ndarray) else float(tempo)
        
        # --- CALCULATE FINAL HESITATION INDEX ---
        hesitation_index = float(pause_ratio)
        hesitation_index = min(max(hesitation_index, 0.0), 1.0) 

        return {
            "hesitation_index": round(hesitation_index, 2),
            "metrics": {
                "total_duration_sec": round(total_duration, 2),
                "pause_ratio": round(pause_ratio, 2),
                "estimated_tempo": round(estimated_tempo, 2)
            }
        }
    except Exception as e:
        raise Exception(f"Audio processing failed: {str(e)}")