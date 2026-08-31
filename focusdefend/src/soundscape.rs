use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SoundscapeType {
    BinauralAlpha,
    PinkRain,
    CosmicDrone,
    FocusStatic,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoundscapeConfig {
    pub sound_type: SoundscapeType,
    pub volume: f32, // 0.0 to 1.0
    pub frequency_carrier_hz: f32,
    pub binaural_beat_hz: f32,
    pub active: bool,
}

impl SoundscapeConfig {
    pub fn default_binaural() -> Self {
        Self {
            sound_type: SoundscapeType::BinauralAlpha,
            volume: 0.6,
            frequency_carrier_hz: 216.0,
            binaural_beat_hz: 14.0, // 14Hz Alpha focus state
            active: false,
        }
    }
}
