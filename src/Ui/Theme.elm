module Ui.Theme exposing
    ( abpColor
    , alertColor
    , backgroundColor
    , bezelColor
    , capnoColor
    , cardColor
    , cvpColor
    , ecgColor
    , gridMajorColor
    , gridMinorColor
    , ppgColor
    , respColor
    , surfaceColor
    , textMutedColor
    , textPrimaryColor
    , warningColor
    )

{-| Standard clinical monitor high-contrast dark visual theme.
Adheres strictly to medical instrumentation color coding conventions:
ECG Lead II: Neon Green (#00ff41)
Arterial Blood Pressure: Crimson Red (#ff2a4b)
SpO2 / Plethysmograph: Cyan Blue (#00e5ff)
Capnography EtCO2: Golden Yellow (#ffcc00)
Central Venous Pressure: Royal Blue (#4d79ff)
Respiration: Amber Orange (#ff9400)
-}


backgroundColor : String
backgroundColor =
    "#06090e"


surfaceColor : String
surfaceColor =
    "#0d1219"


cardColor : String
cardColor =
    "#121822"


bezelColor : String
bezelColor =
    "#1b2332"


textPrimaryColor : String
textPrimaryColor =
    "#f0f6fc"


textMutedColor : String
textMutedColor =
    "#7d8ca3"


ecgColor : String
ecgColor =
    "#00ff41"


abpColor : String
abpColor =
    "#ff2a4b"


ppgColor : String
ppgColor =
    "#00e5ff"


capnoColor : String
capnoColor =
    "#ffcc00"


cvpColor : String
cvpColor =
    "#4d79ff"


respColor : String
respColor =
    "#ff9400"


alertColor : String
alertColor =
    "#ff0033"


warningColor : String
warningColor =
    "#ffcc00"


gridMinorColor : String
gridMinorColor =
    "rgba(255, 65, 54, 0.08)"


gridMajorColor : String
gridMajorColor =
    "rgba(255, 65, 54, 0.18)"
