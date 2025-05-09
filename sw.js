<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <!-- Add iOS-specific meta tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="أذكار وأوقات الصلاة">
    <link rel="apple-touch-icon" href="icon1.png">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <title>أذكار وأوقات الصلاة</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        /* Fallback Compass Styles */
#compass {
    position: relative;
    width: 16rem;
    height: 16rem;
    animation: fadeIn 0.5s ease-in;
}

#qiblaNeedle {
    transition: transform 0.2s ease-out;
    transform-origin: bottom center;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Improve AR Indicator */
#kaabaIndicator {
    transition: transform 0.2s ease-out, opacity 0.5s;
}

/* Calibration Prompt */
#arUnsupported {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* AR View Styles */
#arCamera {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1); /* Mirror camera feed for back camera */
}

#arCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}

#kaabaIndicator {
    position: absolute;
    width: 48px;
    height: 48px;
    top: 0;
    left: 0;
    will-change: transform, opacity;
    z-index: 100;
    pointer-events: none;
    filter: drop-shadow(0 0 12px rgba(255, 200, 50, 0.7));
    transition: transform 0.2s ease-out, opacity 0.3s ease;
}

#qiblaDegree {
    backdrop-filter: blur(10px);
    font-family: monospace;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

/* Fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
    #kaabaIndicator {
        transform: translateZ(0); /* Force hardware acceleration */
    }
}

/* Fallback Compass Styles */
#compass {
    position: relative;
    width: 16rem;
    height: 16rem;
    animation: fadeIn 0.5s ease-in;
}

#qiblaNeedle {
    transition: transform 0.2s ease-out;
    transform-origin: bottom center;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Calibration Prompt */
#arUnsupported {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Flip camera button hover effect */
#flipCameraBtn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    transition: all 0.2s ease;
}

/* Fade-in and fade-out transitions */
.fade-enter {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s ease;
}
.fade-enter-active {
    opacity: 1;
    transform: translateY(0);
}
.fade-leave {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.4s ease;
}
.fade-leave-active {
    opacity: 0;
    transform: translateY(10px);
}

/* Prevent text selection during swipe */
.no-select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Add a click effect with a scale and fade-out effect */
.clicked {
    transform: scale(1.1);
    opacity: 0.8;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

/* Tab styling */
.tab {
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
}
.tab.active {
    border-bottom-color: #3B82F6;
    font-weight: bold;
}
.tab-content {
    display: none;
}
.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes fadeOut {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -20px); }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

.animate-fade-out {
    animation: fadeOut 0.3s ease-out forwards;
}
    </style>
</head>

<body class="bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white min-h-screen flex flex-col">

    <!-- Header Section -->
    <header class="p-4 text-center text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg rounded-b-3xl" id="pageTitle">
        أذكار وأوقات الصلاة
    </header>

    <!-- Update the tutorial modal HTML structure -->
    <div id="tutorialModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" style="display: none;">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 relative">
            <div class="text-center mb-4">
                <i class="fas fa-bell text-3xl text-blue-500 mb-2"></i>
                <h2 class="text-xl font-bold" id="tutorialTitle"></h2>
            </div>
            <div id="iosTutorial" class="hidden">
                <ol class="list-decimal list-inside space-y-3" id="iosSteps"></ol>
                <div class="mt-4 text-sm text-gray-500" id="iosNote"></div>
            </div>
            <div id="androidTutorial" class="hidden">
                <ol class="list-decimal list-inside space-y-3" id="androidSteps"></ol>
            </div>
            <div class="mt-6 flex justify-center">
                <button onclick="closeTutorial()" class="bg-blue-500 text-white px-6 py-2 rounded-lg" id="gotItButton"></button>
            </div>
        </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center border-b border-gray-200 dark:border-gray-700">
        <div class="tab" data-tab="qibla" id="qiblaTab"> 5 القبلة</div>
        <div class="tab active" data-tab="adhkar" id="adhkarTab">الأذكار</div>
        <div class="tab" data-tab="prayer" id="prayerTab">أوقات الصلاة</div>
    </div>

    <main class="flex-grow flex items-center justify-center">
        <!-- Loading Spinner -->
        <div id="loadingSpinner" class="fixed inset-0 flex justify-center items-center bg-white dark:bg-black z-50">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Adhkar Tab Content -->
        <div id="qiblaContent" class="tab-content w-full p-4 hidden">
            <!-- AR Viewport -->
            <div class="relative w-full h-[70vh] bg-black rounded-xl overflow-hidden">
                <video id="arCamera" autoplay playsinline class="w-full h-full object-cover"></video>
                <canvas id="arCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button id="flipCameraBtn" class="bg-white/20 text-white p-3 rounded-full">
                        <i class="fas fa-camera-rotate"></i>
                    </button>
                    <div id="qiblaDegree" class="bg-white/20 text-white px-4 py-2 rounded-full">
                        <i class="fas fa-compass mr-2"></i>
                        <span id="degreeValue">0°</span>
                    </div>
                </div>
                <div id="kaabaIndicator" class="absolute w-12 h-12">
                    <img src="https://cdn-icons-png.flaticon.com/512/7222/7222554.png" alt="Kaaba" class="w-full h-full">
                </div>
            </div>
            <div id="arUnsupported" class="hidden bg-white dark:bg-gray-800 p-6 rounded-lg text-center mt-4">
                <i class="fas fa-triangle-exclamation text-yellow-500 text-3xl mb-3"></i>
                <h3 class="font-bold" id="arErrorTitle"></h3>
                <p class="mb-4" id="arErrorMessage"></p>
                <button onclick="initCompassFallback()" class="bg-blue-500 text-white px-6 py-2 rounded-lg">
                    <i class="fas fa-compass mr-2"></i>
                    <span id="fallbackBtnText"></span>
                </button>
            </div>
        </div>
        <div id="adhkarContent" class="tab-content active w-full">
            <!-- Main Buttons for Morning/Evening Adhkar -->
            <div id="home" class="space-y-4 text-center">
                <button onclick="loadAdhkar('sabah')" id="btnMorning" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full shadow transition-transform hover:scale-105">أذكار الصباح</button>
                <button onclick="loadAdhkar('masaa')" id="btnEvening" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow transition-transform hover:scale-105">أذكار المساء</button>
            </div>

            <!-- Adhkar View Section -->
            <div id="adhkarView" class="hidden max-w-xl p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4 text-center no-select mx-auto">
                <div id="swipeHint" class="text-sm text-gray-400 mb-2">
                    <i class="fas fa-arrows-alt-h mr-1"></i> <span id="swipeHintText">اسحب لليسار أو اليمين للتنقل</span>
                </div>
                <div id="clickHint" class="text-sm text-gray-400 mb-2">
                    <i class="fas fa-hand-pointer mr-1 cursor-pointer"></i> <span id="clickHintText">اضغظ للعد</span>
                </div>
                
                <h2 class="text-xl font-semibold" id="dhikrCounter"></h2>
                <p class="text-2xl leading-loose" id="arabicText"></p>
                <span id="repeatCount" class="text-sm text-gray-500 dark:text-gray-400">
                    <span id="repeatLabel">تكرار</span>: <span id="repeatValue"></span>
                </span>
                <p class="italic" id="transliterationText"></p>
                <p class="text-sm" id="translationText"></p>

                <!-- Navigation Buttons -->
                <div class="flex justify-between mt-4">
                    <button onclick="prevDhikr()" id="btnPrev" class="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-6 py-3 rounded shadow hover:scale-105 transform transition-all duration-200 font-semibold">السابق</button>
                    <button onclick="nextDhikr()" id="btnNext" class="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-6 py-3 rounded shadow hover:scale-105 transform transition-all duration-200 font-semibold">التالي</button>            
                </div>

                <!-- Back to Home Button -->
                <button onclick="goHome()" id="btnBack" class="mt-4 text-blue-500 dark:text-blue-300 hover:underline">الرجوع للرئيسية</button>
            </div>
        </div>

        <!-- Prayer Times Tab Content -->
        <div id="prayerContent" class="tab-content w-full max-w-md p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-center mb-4" id="prayerTitle">أوقات الصلاة</h2>
                <p id="azan-location" class="text-center mb-6">جاري تحديد الموقع...</p>
                
                <!-- Add Notification Toggle -->
                <div class="flex items-center justify-between mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span class="text-sm" id="notificationLabel">إشعارات أوقات الصلاة</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="notificationToggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <ul class="space-y-3">
                    <li class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between" id="azan-fajr">
                        <span>الفجر:</span>
                        <span class="font-medium">--:--</span>
                    </li>
                    <li class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between" id="azan-dhuhr">
                        <span>الظهر:</span>
                        <span class="font-medium">--:--</span>
                    </li>
                    <li class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between" id="azan-asr">
                        <span>العصر:</span>
                        <span class="font-medium">--:--</span>
                    </li>
                    <li class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between" id="azan-maghrib">
                        <span>المغرب:</span>
                        <span class="font-medium">--:--</span>
                    </li>
                    <li class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between" id="azan-isha">
                        <span>العشاء:</span>
                        <span class="font-medium">--:--</span>
                    </li>
                </ul>
                <button id="btnRefresh" onclick="refreshPrayerTimes()" class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i> Refresh
                </button>
            </div>
        </div>
    </main>

    <!-- Footer Section -->
    <footer class="p-4 text-center space-x-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <button onclick="switchLanguage()" id="langToggle" class="text-sm text-gray-600 dark:text-gray-300 hover:underline">English</button>
    </footer>

    <script>
      const adhkar = [];
let current = 0;
let filteredAdhkar = [];
let currentLang = 'ar';
let currentCity = "Amman";

// AR Qibla Finder
let arActive = false;
let cameraStream = null;
let facingMode = "environment";
let currentHeading = 0;
let qiblaAngle = 0;
let animationFrameId = null;
let smoothedHeading = null;

// Variables for swipe detection
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;

// Add these new variables at the top with other variables
let notificationEnabled = false;
let prayerNotifications = {};
let nextPrayerTimeout = null;

const languages = {
    ar: {
        title: "أذكار وأوقات الصلاة",
        morning: "أذكار الصباح",
        evening: "أذكار المساء",
        previous: "السابق",
        next: "التالي",
        back: "الرجوع للرئيسية",
        langSwitch: "English",
        counter: (i, total) => `الذكر ${i} من ${total}`,
        repeatLabel: "تكرار",
        swipeHint: "اسحب لليسار أو اليمين للتنقل",
        clickHint: "اضغط للعد",
        prayerTitle: "أوقات الصلاة",
        fajr: "الفجر",
        dhuhr: "الظهر", // Fixed typo from "dhuabihr"
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
        refresh: "تحديث",
        adhkarTab: "الأذكار",
        prayerTab: "أوقات الصلاة",
        qiblaTab: "القبلة",
        locationText: (city, timezone) => `المدينة: ${city} | المنطقة الزمنية: ${timezone}`,
        arErrorTitle: "الواقع المعزز غير مدعوم",
        arErrorMessage: "هذه الميزة تتطلب هاتفاً مزوداً بمستشعرات الحركة",
        fallbackBtnText: "استخدام البوصلة الأساسية",
        calibrationMessage: "حرك الجهاز على شكل رقم 8 لمعايرة البوصلة",
        calibrationDone: "تم",
        alignedMessage: "موجه نحو القبلة",
        tiltMessage: "أمل جهازك بشكل مسطح",
        notificationPermissionDenied: "يرجى السماح بالإشعارات لتلقي تنبيهات أوقات الصلاة",
        prayerTimeNotification: "حان وقت الصلاة",
        prayerTimeNotificationBody: "حان وقت الصلاة",
        prayerTimeApproaching: "حان وقت الصلاة",
        prayerTimeApproachingBody: "حان وقت صلاة",
        tutorialTitle: "تفعيل الإشعارات",
        tutorialIOS: {
            title: "تفعيل الإشعارات على iOS",
            steps: [
                "اضغط على زر المشاركة (Share) في أسفل المتصفح",
                "اختر \"إضافة إلى الشاشة الرئيسية\" (Add to Home Screen)",
                "اضغط \"إضافة\" (Add) في الأعلى",
                "افتح التطبيق من الشاشة الرئيسية",
                "قم بتفعيل الإشعارات عندما يطلب منك"
            ],
            note: "ملاحظة: يجب أن يكون التطبيق مفتوحاً من الشاشة الرئيسية لتعمل الإشعارات بشكل صحيح"
        },
        tutorialAndroid: {
            title: "تفعيل الإشعارات على Android",
            steps: [
                "اضغط على زر القائمة (ثلاث نقاط) في الأعلى",
                "اختر \"إضافة إلى الشاشة الرئيسية\" (Add to Home Screen)",
                "اضغط \"إضافة\" (Add)",
                "افتح التطبيق من الشاشة الرئيسية",
                "قم بتفعيل الإشعارات عندما يطلب منك"
            ]
        },
        gotIt: "فهمت",
        notificationLabel: "إشعارات أوقات الصلاة"
    },
    en: {
        title: "Adhkar & Prayer Times",
        morning: "Morning Adhkar",
        evening: "Evening Adhkar",
        previous: "Previous",
        next: "Next",
        back: "Back to Home",
        langSwitch: "العربية",
        counter: (i, total) => `Dhikr ${i} of ${total}`,
        repeatLabel: "Repeat",
        swipeHint: "Swipe left or right to navigate",
        clickHint: "Click to Count",
        prayerTitle: "Prayer Times",
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
        refresh: "Refresh",
        adhkarTab: "Adhkar",
        prayerTab: "Prayer Times",
        qiblaTab: "Qibla",
        locationText: (city, timezone) => `City: ${city} | Timezone: ${timezone}`,
        arErrorTitle: "AR Unsupported",
        arErrorMessage: "This feature requires a mobile device with motion sensors",
        fallbackBtnText: "Use Basic Compass",
        calibrationMessage: "Move your device in a figure-8 pattern to calibrate the compass",
        calibrationDone: "Done",
        alignedMessage: "Aligned with Qibla",
        tiltMessage: "Hold device flat",
        notificationPermissionDenied: "Please allow notifications to receive prayer time alerts",
        prayerTimeNotification: "Prayer Time",
        prayerTimeNotificationBody: "It's time for prayer",
        prayerTimeApproaching: "Prayer Time",
        prayerTimeApproachingBody: "It's time for",
        tutorialTitle: "Enable Notifications",
        tutorialIOS: {
            title: "Enable Notifications on iOS",
            steps: [
                "Tap the Share button at the bottom of the browser",
                "Select \"Add to Home Screen\"",
                "Tap \"Add\" at the top",
                "Open the app from your home screen",
                "Enable notifications when prompted"
            ],
            note: "Note: The app must be opened from the home screen for notifications to work properly"
        },
        tutorialAndroid: {
            title: "Enable Notifications on Android",
            steps: [
                "Tap the menu button (three dots) at the top",
                "Select \"Add to Home Screen\"",
                "Tap \"Add\"",
                "Open the app from your home screen",
                "Enable notifications when prompted"
            ]
        },
        gotIt: "Got it",
        notificationLabel: "Prayer Time Notifications"
    }
};

async function initARCamera() {
    console.log("Initializing AR Camera...");

    if (!('DeviceOrientationEvent' in window) || !navigator.mediaDevices) {
        console.error("Device orientation or camera not supported");
        showARUnsupported();
        return;
    }

    // Request permission for motion sensors on iOS
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') {
                console.error("Motion permission denied");
                showARUnsupported();
                return;
            }
        } catch (error) {
            console.error("Error requesting motion permission:", error);
            showARUnsupported();
            return;
        }
    }

    try {
        // Get camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        const video = document.getElementById('arCamera');
        video.srcObject = cameraStream;

        // Get precise location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        });

        // Calculate Qibla direction
        qiblaAngle = calculateQiblaAngle(position.coords.latitude, position.coords.longitude);

        // Start AR rendering
        arActive = true;
        window.addEventListener('deviceorientation', handleOrientation);
        startARRenderLoop();

    } catch (error) {
        console.error("AR initialization failed:", error);
        showARUnsupported();
    }
}

function calculateQiblaAngle(lat, lng) {
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    const φ1 = lat * Math.PI / 180;
    const φ2 = kaabaLat * Math.PI / 180;
    const Δλ = (kaabaLng - lng) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
}

function handleOrientation(event) {
    let heading;

    if (typeof event.webkitCompassHeading !== "undefined") {
        // iOS: use the accurate magnetic heading
        heading = event.webkitCompassHeading;
    } else if (typeof event.alpha === "number") {
        // Android: calculate heading from alpha
        heading = 360 - event.alpha;

        // Adjust for screen orientation
        const orientation = window.screen.orientation || window.orientation;
        let screenAngle = 0;

        if (orientation && typeof orientation.angle === "number") {
            screenAngle = orientation.angle;
        } else if (typeof orientation === "number") {
            screenAngle = orientation;
        }

        // Adjust heading based on screen orientation
        heading = (heading + screenAngle) % 360;
    } else {
        console.warn("Orientation not supported");
        return;
    }

    // Apply smoothing to reduce jitter
    if (typeof currentHeading === 'undefined') {
        currentHeading = heading;
    } else {
        // Calculate the shortest path to the new heading
        let diff = heading - currentHeading;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        // Apply smoothing factor (0.1 = 10% of the difference per update)
        currentHeading = (currentHeading + diff * 0.1 + 360) % 360;
    }

    updateDegreeDisplay();
}

function smoothHeading(newHeading) {
    const smoothingFactor = 0.1;
    if (smoothedHeading === null) {
        smoothedHeading = newHeading;
    } else {
        smoothedHeading += smoothingFactor * (newHeading - smoothedHeading);
    }
    return smoothedHeading;
}

function updateDegreeDisplay() {
    const relativeAngle = (qiblaAngle - currentHeading + 360) % 360;
    const degreeDisplay = document.getElementById('degreeValue');
    
    // Show alignment message when close to Qibla
    if (Math.abs(relativeAngle) < 5 || Math.abs(relativeAngle - 360) < 5) {
        degreeDisplay.textContent = languages[currentLang].alignedMessage;
        degreeDisplay.parentElement.style.backgroundColor = 'rgba(34, 197, 94, 0.8)'; // Green background
    } else {
        // Round to nearest degree for stability
        const roundedAngle = Math.round(relativeAngle);
        degreeDisplay.textContent = `${roundedAngle}°`;
        degreeDisplay.parentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }
}

function startARRenderLoop() {
    const video = document.getElementById('arCamera');
    const canvas = document.getElementById('arCanvas');
    const ctx = canvas.getContext('2d');
    const kaabaIndicator = document.getElementById('kaabaIndicator');

    function render() {
        if (!arActive) return;

        if (video.readyState !== 4) {
            animationFrameId = requestAnimationFrame(render);
            return;
        }

        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        const relativeAngle = (qiblaAngle - currentHeading + 360) % 360;
        const rad = relativeAngle * Math.PI / 180;

        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2;

        // Clear canvas
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        // Draw center dot (alignment target)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        // Position Kaaba indicator
        const radius = Math.min(centerX, centerY) * 0.5;
        let kaabaX = centerX + Math.sin(rad) * radius;
        let kaabaY = centerY - Math.cos(rad) * radius;

        kaabaX = Math.max(30, Math.min(displayWidth - 30, kaabaX));
        kaabaY = Math.max(30, Math.min(displayHeight - 30, kaabaY));

        // Adjust Kaaba indicator opacity based on alignment
        kaabaIndicator.style.transform = `translate(${kaabaX - 24}px, ${kaabaY - 24}px)`;
        kaabaIndicator.style.opacity = Math.abs(relativeAngle) < 5 || Math.abs(relativeAngle - 360) < 5 ? '0.2' : '1';

        // Draw alignment indicator when close to Qibla
        if (Math.abs(relativeAngle) < 5 || Math.abs(relativeAngle - 360) < 5) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
            ctx.fill();
        }

        animationFrameId = requestAnimationFrame(render);
    }

    kaabaIndicator.style.opacity = '0';
    kaabaIndicator.style.transition = 'opacity 0.5s, transform 0.2s';
    render();
}

function showARUnsupported() {
    const el = document.getElementById('arUnsupported');
    el.classList.remove('hidden');
    el.querySelector('#arErrorTitle').textContent = languages[currentLang].arErrorTitle;
    el.querySelector('#arErrorMessage').textContent = languages[currentLang].arErrorMessage;
    el.querySelector('#fallbackBtnText').textContent = languages[currentLang].fallbackBtnText;
}

function showCalibrationPrompt() {
    const unsupportedDiv = document.getElementById('arUnsupported');
    unsupportedDiv.classList.remove('hidden');
    unsupportedDiv.innerHTML = `
        <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-3"></i>
        <h3 class="font-bold">${languages[currentLang].arErrorTitle}</h3>
        <p class="mb-4">${languages[currentLang].calibrationMessage}</p>
        <button onclick="dismissCalibrationPrompt()" class="bg-blue-500 text-white px-6 py-2 rounded-lg">
            <i class="fas fa-check mr-2"></i>
            ${languages[currentLang].calibrationDone}
        </button>
    `;
}

function dismissCalibrationPrompt() {
    document.getElementById('arUnsupported').classList.add('hidden');
}

function initCompassFallback() {
    stopARCamera();

    const qiblaContent = document.getElementById('qiblaContent');
    qiblaContent.innerHTML = `
        <div class="relative w-full h-[70vh] bg-gray-800 rounded-xl flex items-center justify-center">
            <div id="compass" class="w-64 h-64 relative">
                <div class="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                    <i class="fas fa-compass text-6xl text-blue-500"></i>
                </div>
                <div id="qiblaNeedle" class="absolute w-4 h-32 bg-green-500 left-1/2 transform -translate-x-1/2 origin-bottom rounded-t-full"></div>
            </div>
            <div class="absolute bottom-4 text-white text-lg">
                <i class="fas fa-compass mr-2"></i>
                <span id="degreeValue">0°</span>
            </div>
        </div>
    `;

    arActive = true;
    window.addEventListener('deviceorientation', updateFallbackCompass);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            qiblaAngle = calculateQiblaAngle(position.coords.latitude, position.coords.longitude);
        },
        () => {
            qiblaAngle = 0;
            updateDegreeDisplay();
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function updateFallbackCompass(event) {
    if (!event.alpha && !event.webkitCompassHeading || !arActive) return;

    let heading = event.webkitCompassHeading || event.alpha;

    if (!event.webkitCompassHeading) {
        const orientation = window.screen.orientation?.angle || 0;
        switch (orientation) {
            case 90:
                heading = (heading + 270) % 360;
                break;
            case 270:
                heading = (heading + 90) % 360;
                break;
            case 180:
                heading = (360 - heading) % 360;
                break;
        }
    }

    currentHeading = smoothHeading(heading);
    const relativeAngle = (qiblaAngle - currentHeading + 360) % 360;
    const degreeDisplay = document.getElementById('degreeValue');

    if (Math.abs(relativeAngle) < 5 || Math.abs(relativeAngle - 360) < 5) {
        degreeDisplay.textContent = languages[currentLang].alignedMessage;
        degreeDisplay.parentElement.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
    } else {
        degreeDisplay.textContent = `${Math.round(relativeAngle)}°`;
        degreeDisplay.parentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }

    const needle = document.getElementById('qiblaNeedle');
    needle.style.transform = `translateX(-50%) rotate(${relativeAngle}deg)`;
}

function stopARCamera() {
    arActive = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    window.removeEventListener('deviceorientation', handleOrientation);
    window.removeEventListener('deviceorientation', updateFallbackCompass);
}

// Event Listeners
document.getElementById('flipCameraBtn').addEventListener('click', () => {
    facingMode = facingMode === "user" ? "environment" : "user";
    stopARCamera();
    initARCamera();
});

function handleDhikrClick() {
    const arabicText = document.getElementById('arabicText');
    arabicText.classList.add('clicked');
    setTimeout(() => arabicText.classList.remove('clicked'), 300);

    if (filteredAdhkar[current].remainingRepeats > 0) {
        filteredAdhkar[current].remainingRepeats--;
        updateRepeatCounter();
    }
}

function updateRepeatCounter() {
    document.getElementById('repeatValue').innerText = filteredAdhkar[current].remainingRepeats;
}

function switchLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateUI();
    displayDhikr();
    updatePrayerTimesUI();
    
    // Update tutorial if it's visible
    const modal = document.getElementById('tutorialModal');
    if (!modal.classList.contains('hidden')) {
        showTutorial();
    }
}

function updateUI() {
    const lang = languages[currentLang];
    document.getElementById('pageTitle').innerText = lang.title;
    document.getElementById('btnMorning').innerText = lang.morning;
    document.getElementById('btnEvening').innerText = lang.evening;
    document.getElementById('btnPrev').innerText = lang.previous;
    document.getElementById('btnNext').innerText = lang.next;
    document.getElementById('btnBack').innerText = lang.back;
    document.getElementById('langToggle').innerText = lang.langSwitch;
    document.getElementById('repeatLabel').innerText = lang.repeatLabel;
    document.getElementById('swipeHintText').innerText = lang.swipeHint;
    document.getElementById('clickHintText').innerText = lang.clickHint;
    document.getElementById('adhkarTab').innerText = lang.adhkarTab;
    document.getElementById('prayerTab').innerText = lang.prayerTab;
    document.getElementById('qiblaTab').innerText = lang.qiblaTab;
    document.getElementById('btnRefresh').innerHTML = `<i class="fas fa-sync-alt mr-2"></i> ${lang.refresh}`;
    document.getElementById('notificationLabel').innerText = lang.notificationLabel;
}

function updatePrayerTimesUI() {
    const lang = languages[currentLang];
    document.getElementById('prayerTitle').innerText = lang.prayerTitle;
    document.querySelector('#azan-fajr span:first-child').innerText = lang.fajr + ":";
    document.querySelector('#azan-dhuhr span:first-child').innerText = lang.dhuhr + ":";
    document.querySelector('#azan-asr span:first-child').innerText = lang.asr + ":";
    document.querySelector('#azan-maghrib span:first-child').innerText = lang.maghrib + ":";
    document.querySelector('#azan-isha span:first-child').innerText = lang.isha + ":";
}

fetch('adhkar.json')
    .then(res => res.json())
    .then(data => {
        adhkar.push(...data);
        document.getElementById('loadingSpinner').classList.add('hidden');
    })
    .catch(err => console.error("Error loading adhkar.json:", err));

function loadAdhkar(time) {
    filteredAdhkar = adhkar.filter(d => d.time === time).map(d => ({
        ...d,
        remainingRepeats: d.repeat
    }));
    current = 0;
    document.getElementById('home').classList.add('fade-leave');
    setTimeout(() => {
        document.getElementById('home').classList.add('hidden');
        document.getElementById('adhkarView').classList.remove('hidden', 'fade-leave');
        document.getElementById('adhkarView').classList.add('fade-enter');
        requestAnimationFrame(() => document.getElementById('adhkarView').classList.add('fade-enter-active'));
    }, 300);
    displayDhikr();
}

function displayDhikr() {
    if (!filteredAdhkar.length) return;
    const dhikr = filteredAdhkar[current];
    document.getElementById('arabicText').innerText = dhikr.arabic;
    document.getElementById('transliterationText').innerText = dhikr.transliteration;
    document.getElementById('translationText').innerText = dhikr.translation;
    document.getElementById('dhikrCounter').innerText = languages[currentLang].counter(current + 1, filteredAdhkar.length);
    document.getElementById('repeatValue').innerText = dhikr.remainingRepeats;
}

function nextDhikr() {
    if (current < filteredAdhkar.length - 1) {
        current++;
        displayDhikr();
    }
}

function prevDhikr() {
    if (current > 0) {
        current--;
        displayDhikr();
    }
}

function goHome() {
    document.getElementById('adhkarView').classList.add('fade-leave');
    setTimeout(() => {
        document.getElementById('adhkarView').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
        document.getElementById('home').classList.add('fade-enter');
        requestAnimationFrame(() => document.getElementById('home').classList.add('fade-enter-active'));
    }, 300);
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < swipeThreshold) return;
    if (diff > 0) {
        nextDhikr();
    } else {
        prevDhikr();
    }
}

// Add these storage helper functions at the top with other variables
function savePrayerTimes(timings, location, city) {
    const data = {
        timings: timings,
        location: location,
        city: city,
        lastUpdated: new Date().toISOString()
    };

    // Save to localStorage
    try {
        localStorage.setItem('prayerTimes', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }

    // For iOS, also save to sessionStorage as backup
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        try {
            sessionStorage.setItem('prayerTimes', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
    }
}

function loadPrayerTimes() {
    let savedData = null;

    // Try localStorage first
    try {
        const localStorageData = localStorage.getItem('prayerTimes');
        if (localStorageData) {
            savedData = JSON.parse(localStorageData);
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }

    // If no data in localStorage and on iOS, try sessionStorage
    if (!savedData && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        try {
            const sessionStorageData = sessionStorage.getItem('prayerTimes');
            if (sessionStorageData) {
                savedData = JSON.parse(sessionStorageData);
            }
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
        }
    }

    if (savedData) {
        const lastUpdated = new Date(savedData.lastUpdated);
        const now = new Date();
        
        // Check if the saved data is from today
        if (lastUpdated.toDateString() === now.toDateString()) {
            prayerNotifications = savedData.timings;
            currentCity = savedData.city;
            
            // Update UI with saved times
            document.getElementById("azan-location").innerText = languages[currentLang].locationText(savedData.city, savedData.location);
            document.querySelector("#azan-fajr span:last-child").innerText = savedData.timings.Fajr;
            document.querySelector("#azan-dhuhr span:last-child").innerText = savedData.timings.Dhuhr;
            document.querySelector("#azan-asr span:last-child").innerText = savedData.timings.Asr;
            document.querySelector("#azan-maghrib span:last-child").innerText = savedData.timings.Maghrib;
            document.querySelector("#azan-isha span:last-child").innerText = savedData.timings.Isha;
            
            console.log('Loaded saved prayer times:', savedData.timings);
            
            // Setup notifications if enabled
            if (notificationEnabled) {
                setupPrayerNotifications();
            }
            return true;
        }
    }
    return false;
}

// Update the fetchPrayerTimes function
async function fetchPrayerTimes(city = "Amman") {
    const today = new Date().toISOString().split('T')[0];
    const formattedDate = today.split('-').reverse().join('-');
    const url = `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            const location = data.data.meta.timezone;

            // Store timings for notifications
            prayerNotifications = timings;
            
            // Save to storage
            savePrayerTimes(timings, location, city);
            console.log('Prayer times updated and saved:', timings);

            document.getElementById("azan-location").innerText = languages[currentLang].locationText(city, location);
            document.querySelector("#azan-fajr span:last-child").innerText = timings.Fajr;
            document.querySelector("#azan-dhuhr span:last-child").innerText = timings.Dhuhr;
            document.querySelector("#azan-asr span:last-child").innerText = timings.Asr;
            document.querySelector("#azan-maghrib span:last-child").innerText = timings.Maghrib;
            document.querySelector("#azan-isha span:last-child").innerText = timings.Isha;

            // Setup notifications if enabled
            if (notificationEnabled) {
                console.log('Setting up notifications after prayer times update');
                setupPrayerNotifications();
            }
        } else {
            console.error('Error fetching prayer times:', data);
            document.getElementById("azan-location").innerText = languages[currentLang].arErrorMessage;
        }
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        document.getElementById("azan-location").innerText = languages[currentLang].arErrorMessage;
    }
}

async function detectCityAndFetchTimes() {
    try {
        const locationRes = await fetch("https://ipapi.co/json/");
        const locationData = await locationRes.json();
        currentCity = locationData.city || "Amman";
        await fetchPrayerTimes(currentCity);
    } catch (error) {
        console.error("Could not detect city, falling back to Amman.", error);
        await fetchPrayerTimes("Amman");
    }
}

function refreshPrayerTimes() {
    fetchPrayerTimes(currentCity);
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}Content`).classList.add('active');

            if (tabId === 'qibla') {
                initARCamera();
            } else {
                stopARCamera();
            }
        });
    });
}

// Add these new functions for notification handling
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js', {
                scope: './'
            });
            console.log('Service Worker registered with scope:', registration.scope);

            // For iOS, request background fetch permission
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                try {
                    await registration.periodicSync.register('prayer-times', {
                        minInterval: 15 * 60 * 1000 // 15 minutes
                    });
                    console.log('Periodic sync registered for prayer times');
                } catch (error) {
                    console.error('Periodic sync registration failed:', error);
                }
            }

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }
    return null;
}

async function requestNotificationPermission() {
    try {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        // Check if the app is running in standalone mode (added to home screen)
        const isInStandaloneMode = ('standalone' in navigator) && (navigator.standalone);
        
        if (isIOS && !isInStandaloneMode) {
            // Show instructions for adding to home screen first
            showTutorial();
            return false;
        }

        // Check if notifications are supported
        if (!('Notification' in window)) {
            const notSupportedMessage = currentLang === 'ar'
                ? 'المتصفح لا يدعم الإشعارات'
                : 'Notifications are not supported in this browser';
            alert(notSupportedMessage);
            return false;
        }
        
        // Request permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            try {
                notificationEnabled = true;
                document.getElementById('notificationToggle').checked = true;
                
                if (isIOS) {
                    // For iOS, use basic notifications
                    setupBasicNotifications();
                    // Show success message
                    const successMessage = currentLang === 'ar'
                        ? 'تم تفعيل الإشعارات بنجاح'
                        : 'Notifications enabled successfully';
                    alert(successMessage);
                } else {
                    // For Android, use push notifications
                    const registration = await registerServiceWorker();
                    if (registration) {
                        try {
                            const subscription = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: 'BOPaG1Jwr89JCSdQ1ejhuPmyKXGVQLQjI2SJfeaYT-LiUjf44KtxCS_JSq-cVxE9O0q7sExLbs2mO4aO0KWPJcc'
                            });
                            localStorage.setItem('pushSubscription', JSON.stringify(subscription));
                            setupPrayerNotifications();
                            // Show success message
                            const successMessage = currentLang === 'ar'
                                ? 'تم تفعيل الإشعارات بنجاح'
                                : 'Notifications enabled successfully';
                            alert(successMessage);
                        } catch (error) {
                            console.error('Push subscription failed:', error);
                            setupBasicNotifications();
                        }
                    } else {
                        setupBasicNotifications();
                    }
                }
                return true;
            } catch (error) {
                console.error('Error setting up notifications:', error);
                notificationEnabled = false;
                document.getElementById('notificationToggle').checked = false;
                
                if (isIOS) {
                    const iosErrorMessage = currentLang === 'ar'
                        ? 'حدث خطأ في تفعيل الإشعارات. يرجى:\n\n1. التأكد من أن التطبيق مفتوح من الشاشة الرئيسية\n2. التأكد من تفعيل الإشعارات في إعدادات Safari\n3. إعادة تشغيل التطبيق'
                        : 'Error enabling notifications. Please:\n\n1. Make sure the app is opened from home screen\n2. Check Safari settings for notifications\n3. Restart the app';
                    alert(iosErrorMessage);
                } else {
                    const errorMessage = currentLang === 'ar'
                        ? 'حدث خطأ في تفعيل الإشعارات'
                        : 'Error enabling notifications';
                    alert(errorMessage);
                }
                return false;
            }
        } else {
            notificationEnabled = false;
            document.getElementById('notificationToggle').checked = false;
            
            // Show more detailed message for iOS
            if (isIOS) {
                const iosPermissionMessage = currentLang === 'ar'
                    ? 'لتفعيل الإشعارات في iOS:\n\n1. افتح إعدادات جهازك\n2. انتقل إلى Safari > الإعدادات\n3. قم بتفعيل "السماح بالإشعارات"\n4. أعد تشغيل التطبيق'
                    : 'To enable notifications on iOS:\n\n1. Open your device settings\n2. Go to Safari > Settings\n3. Enable "Allow Notifications"\n4. Restart the app';
                alert(iosPermissionMessage);
            } else {
                const permissionDeniedMessage = currentLang === 'ar'
                    ? 'يرجى السماح بالإشعارات في إعدادات المتصفح'
                    : 'Please allow notifications in your browser settings';
                alert(permissionDeniedMessage);
            }
            return false;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        notificationEnabled = false;
        document.getElementById('notificationToggle').checked = false;
        const errorMessage = currentLang === 'ar'
            ? 'حدث خطأ أثناء تفعيل الإشعارات'
            : 'An error occurred while enabling notifications';
        alert(errorMessage);
        return false;
    }
}

function setupBasicNotifications() {
    if (!notificationEnabled) {
        console.log('Notifications not enabled');
        return;
    }

    // Clear any existing notifications
    if (nextPrayerTimeout) {
        clearTimeout(nextPrayerTimeout);
    }

    const now = new Date();
    const timings = prayerNotifications;
    let nextPrayer = null;
    let nextPrayerTime = null;

    console.log('Current time:', now.toLocaleTimeString());
    console.log('Prayer times:', timings);

    // Find the next prayer time
    for (const [prayer, time] of Object.entries(timings)) {
        const prayerTime = new Date(`${now.toDateString()} ${time}`);
        console.log(`Checking ${prayer}: ${prayerTime.toLocaleTimeString()}`);
        
        if (prayerTime > now) {
            if (!nextPrayerTime || prayerTime < nextPrayerTime) {
                nextPrayer = prayer;
                nextPrayerTime = prayerTime;
            }
        }
    }

    if (nextPrayer && nextPrayerTime) {
        const timeUntilNext = nextPrayerTime - now;
        console.log('Next prayer:', nextPrayer, 'at', nextPrayerTime.toLocaleTimeString());
        
        // Schedule notification 5 minutes before prayer time
        const notificationTime = timeUntilNext - (5 * 60 * 1000);
        console.log('Time until notification:', Math.floor(notificationTime / 60000), 'minutes');
        
        if (notificationTime > 0) {
            console.log('Setting up notification for:', new Date(now.getTime() + notificationTime).toLocaleTimeString());
            
            // For iOS in standalone mode, use background fetch
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && ('standalone' in navigator) && (navigator.standalone)) {
                // Schedule a background fetch
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.backgroundFetch.fetch('prayer-notification', ['adhan.mp3'], {
                            title: languages[currentLang].prayerTimeNotification,
                            icons: [{
                                sizes: '192x192',
                                src: 'icon1.png',
                                type: 'image/png',
                            }],
                            downloadTotal: 1,
                        });
                    });
                }
            } else {
                // For Android or iOS not in standalone mode, use setTimeout
                nextPrayerTimeout = setTimeout(() => {
                    console.log('Notification timeout triggered');
                    showBasicNotification(nextPrayer);
                }, notificationTime);
            }
        } else {
            console.log('Notification time has already passed');
        }
    } else {
        console.log('No upcoming prayer times found');
    }
}

function showBasicNotification(prayer) {
    if (!notificationEnabled) return;

    const prayerNames = {
        'Fajr': currentLang === 'ar' ? 'الفجر' : 'Fajr',
        'Dhuhr': currentLang === 'ar' ? 'الظهر' : 'Dhuhr',
        'Asr': currentLang === 'ar' ? 'العصر' : 'Asr',
        'Maghrib': currentLang === 'ar' ? 'المغرب' : 'Maghrib',
        'Isha': currentLang === 'ar' ? 'العشاء' : 'Isha'
    };

    try {
        const notification = new Notification(languages[currentLang].prayerTimeNotification, {
            body: `${prayerNames[prayer]} ${languages[currentLang].prayerTimeApproachingBody}`,
            icon: 'icon1.png',
            badge: 'icon1.png',
            requireInteraction: true,
            silent: false
        });

        // Play adhan sound
        const audio = new Audio('adhan.mp3');
        audio.play().catch(error => console.error('Error playing adhan:', error));

        // Setup next notification
        setupBasicNotifications();
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            alert(`${prayerNames[prayer]} ${languages[currentLang].prayerTimeApproachingBody}`);
            const audio = new Audio('adhan.mp3');
            audio.play().catch(error => console.error('Error playing adhan:', error));
        }
    }
}

async function setupPrayerNotifications() {
    if (!notificationEnabled) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in navigator) && (navigator.standalone);

    // For iOS in standalone mode, use background fetch
    if (isIOS && isInStandaloneMode) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.periodicSync.register('prayer-times', {
                minInterval: 15 * 60 * 1000 // 15 minutes
            });
            console.log('Periodic sync registered for prayer times');
        } catch (error) {
            console.error('Periodic sync registration failed:', error);
            // Fallback to basic notifications
            setupBasicNotifications();
        }
    } else {
        // For Android or iOS not in standalone mode, use basic notifications
        setupBasicNotifications();
    }
}

// Add periodic check for prayer times
function setupPeriodicChecks() {
    // Check prayer times every hour
    setInterval(() => {
        console.log('Running periodic prayer times check');
        fetchPrayerTimes(currentCity);
    }, 60 * 60 * 1000); // Every hour
}

// Add these functions to handle the tutorial
function showTutorial() {
    // Basic iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone === true;
    
    console.log('Showing tutorial for:', {
        isIOS,
        isInStandaloneMode,
        userAgent: navigator.userAgent
    });

    const modal = document.getElementById('tutorialModal');
    const iosTutorial = document.getElementById('iosTutorial');
    const androidTutorial = document.getElementById('androidTutorial');
    const title = document.getElementById('tutorialTitle');
    const gotItButton = document.getElementById('gotItButton');
    const iosSteps = document.getElementById('iosSteps');
    const androidSteps = document.getElementById('androidSteps');
    const iosNote = document.getElementById('iosNote');

    // Set language-specific content
    const lang = languages[currentLang];
    title.textContent = lang.tutorialTitle;
    gotItButton.textContent = lang.gotIt;

    // Set text alignment based on language
    const textAlignment = currentLang === 'ar' ? 'text-right' : 'text-left';
    iosSteps.className = `list-decimal list-inside space-y-3 ${textAlignment}`;
    androidSteps.className = `list-decimal list-inside space-y-3 ${textAlignment}`;
    iosNote.className = `mt-4 text-sm text-gray-500 ${textAlignment}`;

    // Set iOS tutorial content
    if (isIOS) {
        iosTutorial.classList.remove('hidden');
        androidTutorial.classList.add('hidden');
        
        // Clear previous steps
        iosSteps.innerHTML = '';
        
        // Add new steps
        lang.tutorialIOS.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            iosSteps.appendChild(li);
        });
        
        // Add note
        iosNote.textContent = lang.tutorialIOS.note;
    } else {
        // Set Android tutorial content
        iosTutorial.classList.add('hidden');
        androidTutorial.classList.remove('hidden');
        
        // Clear previous steps
        androidSteps.innerHTML = '';
        
        // Add new steps
        lang.tutorialAndroid.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            androidSteps.appendChild(li);
        });
    }

    // Show modal with iOS-specific handling
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    
    // Force a reflow to ensure the modal is visible
    modal.offsetHeight;
    
    // Add a small delay for iOS
    if (isIOS) {
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 50);
    } else {
        modal.style.opacity = '1';
    }
}

function closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.style.opacity = '0';
    
    // Wait for fade out animation
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }, 300);
}

document.addEventListener('DOMContentLoaded', async () => {
    const adhkarView = document.getElementById('adhkarView');
    const arabicText = document.getElementById('arabicText');

    if (adhkarView) {
        adhkarView.addEventListener('touchstart', handleTouchStart, false);
        adhkarView.addEventListener('touchend', handleTouchEnd, false);
    }

    if (arabicText) {
        arabicText.addEventListener('click', handleDhikrClick);
    }

    setupTabs();

    // Try to load saved prayer times first
    if (!loadPrayerTimes()) {
        // If no saved times or they're from a different day, fetch new times
        await detectCityAndFetchTimes();
    }

    // Add notification toggle handler
    const notificationToggle = document.getElementById('notificationToggle');
    
    // Check initial notification state
    if (Notification.permission === 'granted') {
        notificationEnabled = true;
        notificationToggle.checked = true;
        await setupPrayerNotifications();
    } else {
        notificationEnabled = false;
        notificationToggle.checked = false;
    }

    notificationToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isInStandaloneMode = window.navigator.standalone === true;
            
            console.log('Notification toggle clicked:', {
                isIOS,
                isInStandaloneMode,
                userAgent: navigator.userAgent
            });
            
            // Show tutorial first for iOS users
            if (isIOS && !isInStandaloneMode) {
                showTutorial();
                e.target.checked = false;
                return;
            }
            
            // For Android and other devices, show tutorial before requesting permissions
            if (!isIOS) {
                showTutorial();
            }
            
            const success = await requestNotificationPermission();
            if (!success) {
                e.target.checked = false;
            }
        } else {
            notificationEnabled = false;
            if (nextPrayerTimeout) {
                clearTimeout(nextPrayerTimeout);
            }
            // Unsubscribe from push notifications if they exist
            const subscription = localStorage.getItem('pushSubscription');
            if (subscription) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    const pushSubscription = JSON.parse(subscription);
                    if (pushSubscription && pushSubscription.unsubscribe) {
                        await pushSubscription.unsubscribe();
                    }
                    localStorage.removeItem('pushSubscription');
                    console.log('Successfully unsubscribed from push notifications');
                } catch (error) {
                    console.error('Error unsubscribing from push notifications:', error);
                }
            }
        }
    });

    // Add periodic checks
    setupPeriodicChecks();
});
    </script>
</body>
</html>