






  // Dark mode functionality
        function initDarkMode() {
            const darkModeToggle = document.getElementById('darkModeToggle');
            const html = document.documentElement;
            
            // Check for saved theme preference or use system preference
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Set initial theme
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            
            // Toggle dark mode
            darkModeToggle.addEventListener('click', () => {
                html.classList.toggle('dark');
                const isDark = html.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                
                // Update toggle button icon
                const moonIcon = darkModeToggle.querySelector('.fa-moon');
                const sunIcon = darkModeToggle.querySelector('.fa-sun');
                if (isDark) {
                    moonIcon.classList.add('hidden');
                    sunIcon.classList.remove('hidden');
                } else {
                    moonIcon.classList.remove('hidden');
                    sunIcon.classList.add('hidden');
                }
                
                // Remove focus from button to clear yellow effect
                darkModeToggle.blur();
            });
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        html.classList.add('dark');
                    } else {
                        html.classList.remove('dark');
                    }
                }
            });
        }


        // Date Functions
        function updateHijriDate() {
            const today = new Date();
            
            // Force Gregorian calendar for both languages
            let gregorianDate;
            if (currentLang === 'ar') {
                // For Arabic, use Gregorian calendar explicitly
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    calendar: 'gregory'
                };
                try {
                    gregorianDate = today.toLocaleDateString('ar-SA-u-ca-gregory', options);
                } catch (e) {
                    // Fallback: use English format if Arabic Gregorian fails
                    gregorianDate = today.toLocaleDateString('en-US', options);
                }
            } else {
                gregorianDate = today.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
            
            // Set Gregorian date as main date immediately
            document.getElementById('gregorianDate').textContent = gregorianDate;
            
            // Simple Hijri conversion (approximate)
            const hijriMonths = [
                { ar: 'محرم', en: 'Muharram' },
                { ar: 'صفر', en: 'Safar' },
                { ar: 'ربيع الأول', en: 'Rabi\' al-awwal' },
                { ar: 'ربيع الآخر', en: 'Rabi\' al-thani' },
                { ar: 'جمادى الأولى', en: 'Jumada al-awwal' },
                { ar: 'جمادى الآخرة', en: 'Jumada al-thani' },
                { ar: 'رجب', en: 'Rajab' },
                { ar: 'شعبان', en: 'Sha\'ban' },
                { ar: 'رمضان', en: 'Ramadan' },
                { ar: 'شوال', en: 'Shawwal' },
                { ar: 'ذو القعدة', en: 'Dhu al-Qi\'dah' },
                { ar: 'ذو الحجة', en: 'Dhu al-Hijjah' }
            ];
            
            // Fetch from Islamic calendar API for Hijri date (as secondary)
            fetch(`https://api.aladhan.com/v1/gToH/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const hijri = data.data.hijri;
                        const monthName = hijriMonths[hijri.month.number - 1];
                        const hijriText = currentLang === 'ar' 
                            ? `${hijri.day} ${monthName.ar} ${hijri.year} هـ`
                            : `${hijri.day} ${monthName.en} ${hijri.year} AH`;
                        
                        document.getElementById('hijriDate').textContent = hijriText;
                    }
                })
                .catch(() => {
                    // Fallback if API fails
                    document.getElementById('hijriDate').textContent = currentLang === 'ar' ? 'التاريخ الهجري' : 'Islamic Date';
                });
        }


      function toArabicNumerals(num) {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(num).split('').map(digit => arabicNumerals[digit]).join('');
      }

      const adhkar = [];
      let current = 0;
      let filteredAdhkar = [];
let currentLang = 'ar';
let currentCity = "Amman";

// Prayer time format preference
let is24HourFormat = localStorage.getItem('is24HourFormat') === 'true';

// First visit tracking for bookmark tooltip
let isFirstVisit = localStorage.getItem('hasVisitedBefore') !== 'true';

// Single verse loop for memorization
let isSingleVerseLoop = localStorage.getItem('isSingleVerseLoop') === 'true';
let singleVerseLoopTimeout = null;

// Quran Controls variables
let quranControls = null;
let lastScrollTop = 0;
let scrollThreshold = 1; // Very small threshold for immediate response
let quranScrollTimeout;
let scrollHandler = null;

// Function to get or update controls reference
function getQuranControls() {
  if (!quranControls || !document.contains(quranControls)) {
    quranControls = document.querySelector('.quran-controls-sticky');
  }
  return quranControls;
}

// Simple Qibla Compass
      let compassActive = false;
      let currentHeading = 0;
      let qiblaAngle = 0;
      let userLocation = null;
      let smoothedHeading = null;

      function createParticles(element) {
          const numParticles = 12;
          const container = element.parentElement;
          
          for (let i = 0; i < numParticles; i++) {
              const particle = document.createElement('div');
              particle.className = 'qibla-particle';
              
              // Calculate random angle and distance
              const angle = (i / numParticles) * 360;
              const distance = 50 + Math.random() * 30;
              
              // Set custom properties for the animation
              particle.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * distance}px`);
              particle.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * distance}px`);
              
              // Set animation
              particle.style.animation = 'qibla-success-particles 1s ease-out forwards';
              
              container.appendChild(particle);
              
              // Remove particle after animation
              setTimeout(() => {
                  particle.remove();
              }, 1000);
          }
      }

      function updateCompassOrientation(heading) {
          if (!compassActive) return;

          // Apply smoothing to the heading
          if (smoothedHeading === null) {
              smoothedHeading = heading;
          } else {
              const smoothingFactor = 0.2;
              smoothedHeading = smoothedHeading * (1 - smoothingFactor) + heading * smoothingFactor;
          }

          const compass = document.getElementById('qiblaNeedle');
          const kaaba = document.getElementById('kaabaIndicator');
          const qiblaDegree = document.getElementById('qiblaDegree');
          
          if (!compass || !kaaba || !qiblaDegree) return;

          // Update compass rotation
          compass.style.transform = `rotate(${smoothedHeading}deg)`;
          kaaba.style.transform = `rotate(${qiblaAngle - smoothedHeading}deg)`;

          // Calculate the difference between current heading and Qibla angle
          let difference = Math.abs((qiblaAngle - smoothedHeading + 360) % 360);
          if (difference > 180) difference = 360 - difference;

          // Update the degree display
          qiblaDegree.textContent = Math.round(difference) + '°';

          // Check if pointing towards Qibla (within 5 degrees)
          if (difference <= 5) {
              if (!compass.classList.contains('qibla-success')) {
                  compass.classList.add('qibla-success');
                  createParticles(compass);
                  
                  // Add success styles to the degree display
                  qiblaDegree.style.color = '#22c55e';
                  qiblaDegree.style.animation = 'qibla-text-glow 2s ease-in-out infinite';
                  
                  // Vibrate if available
                  if (navigator.vibrate) {
                      navigator.vibrate([100, 50, 100]);
                  }
              }
          } else {
              compass.classList.remove('qibla-success');
              qiblaDegree.style.color = '';
              qiblaDegree.style.animation = '';
          }
      }

// Variables for swipe detection
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;
let autoSwipeEnabled = false;

      // Add these new variables at the top with other variables
      let notificationEnabled = false;
      let prayerNotifications = {};
      let notificationTimeouts = [];
      let nextPrayerTimeout = null;

// Add Quran-related variables
let currentSurah = null;
let currentAyah = 0;
let quranData = null;
let translationData = null;
let currentTranslationKey = 'en.sahih'; // Default translation

// English Surah names mapping
const surahNamesEnglish = [
  "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Maidah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shuraa", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

// Add these new variables at the top with other variables
let isReadingMode = false;
let isTranslationVisible = true;
let currentBookmark = null;
let readingModeAyahs = [];

// Add these variables at the top with other variables
let isTafsirVisible = false;
let tafsirData = null;

// Add these variables at the top with other variables
let currentAudioSurah = null;
let currentAudioAyah = null;

// Reading progress variables
let progressBarVisible = false;
let scrollTimeout = null;

      // Tasbih Counter Variables
      let tasbihCount = 0;
      let tasbihTarget = 33;
      let currentTasbihText = 'سبحان الله';
      let currentTasbihTranslation = 'Glory be to Allah';

      // Tasbih Functions
      function incrementTasbih() {
          tasbihCount++;
          document.getElementById('tasbihCount').textContent = tasbihCount;
          
          // Haptic feedback if available
          if (navigator.vibrate) {
              navigator.vibrate(50);
          }
          
          // Check if target reached
          if (tasbihCount === tasbihTarget) {
              // Celebration animation
              const button = event.target.closest('button');
              button.style.transform = 'scale(1.2)';
              setTimeout(() => {
                  button.style.transform = '';
              }, 200);
              
              // Show completion message
              const message = currentLang === 'ar' 
                  ? `تم إكمال ${tasbihTarget} من ${currentTasbihText}` 
                  : `Completed ${tasbihTarget} of ${currentTasbihText}`;
              showToast(message, 'success');
              
              // Auto-reset after 2 seconds
              setTimeout(() => {
                  resetTasbih();
              }, 2000);
          }
          
          // Save to localStorage
          localStorage.setItem('tasbihCount', tasbihCount);
      }
      
      function resetTasbih() {
          tasbihCount = 0;
          document.getElementById('tasbihCount').textContent = tasbihCount;
          localStorage.removeItem('tasbihCount');
      }
      
      function changeTasbihTarget() {
          const newTarget = prompt(
              currentLang === 'ar' ? 'أدخل الهدف الجديد:' : 'Enter new target:',
              tasbihTarget
          );
          if (newTarget && !isNaN(newTarget) && newTarget > 0) {
              tasbihTarget = parseInt(newTarget);
              updateTasbihTarget();
              localStorage.setItem('tasbihTarget', tasbihTarget);
          }
      }
      
      function setDhikr(arabic, english, target) {
          currentTasbihText = arabic;
          currentTasbihTranslation = english;
          tasbihTarget = target;
          resetTasbih();
          updateTasbihDisplay();
          localStorage.setItem('currentTasbih', JSON.stringify({
              arabic: arabic,
              english: english,
              target: target
          }));
      }
      
      function updateTasbihDisplay() {
          document.getElementById('currentDhikr').textContent = currentTasbihText;
          document.getElementById('currentDhikrTranslation').textContent = currentTasbihTranslation;
          updateTasbihTarget();
      }
      
      function updateTasbihTarget() {
          const targetText = currentLang === 'ar' ? `الهدف: ${tasbihTarget}` : `Target: ${tasbihTarget}`;
          document.getElementById('tasbihTarget').textContent = targetText;
      }
      
      function loadTasbihState() {
          // Load saved count
          const savedCount = localStorage.getItem('tasbihCount');
          if (savedCount) {
              tasbihCount = parseInt(savedCount);
              document.getElementById('tasbihCount').textContent = tasbihCount;
          }
          
          // Load saved target
          const savedTarget = localStorage.getItem('tasbihTarget');
          if (savedTarget) {
              tasbihTarget = parseInt(savedTarget);
          }
          
          // Load saved dhikr
          const savedTasbih = localStorage.getItem('currentTasbih');
          if (savedTasbih) {
              const tasbih = JSON.parse(savedTasbih);
              currentTasbihText = tasbih.arabic;
              currentTasbihTranslation = tasbih.english;
              tasbihTarget = tasbih.target;
          }
          
          updateTasbihDisplay();
      }

      // Islamic Guides functionality
      let islamicGuidesData = null;
      let islamicGuidesVisible = false;
      let showAllGuides = false;
      let selectedCategory = 'all';
      const INITIAL_GUIDES_COUNT = 6;

      async function loadIslamicGuides() {
          try {
              const response = await fetch('./islamic-guides.json');
              islamicGuidesData = await response.json();
              renderIslamicGuides();
          } catch (error) {
              console.error('Error loading Islamic guides:', error);
          }
      }

      function renderIslamicGuides() {
          if (!islamicGuidesData) return;

          const guidesList = document.getElementById('islamicGuidesList');
          const showMoreContainer = document.getElementById('showMoreGuidesContainer');
          
          guidesList.innerHTML = '';
          
          // Filter guides by category
          let filteredGuides = selectedCategory === 'all' ? 
              islamicGuidesData.guides : 
              islamicGuidesData.guides.filter(guide => guide.category.en.toLowerCase() === selectedCategory.toLowerCase());
          
          // Determine how many guides to show
          const guidesToShow = showAllGuides ? filteredGuides : filteredGuides.slice(0, INITIAL_GUIDES_COUNT);
          
          guidesToShow.forEach(guide => {
              const guideCard = document.createElement('button');
              guideCard.className = 'group bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 border border-amber-200 dark:border-amber-700 text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-200 py-3 px-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 text-left';
              
              guideCard.onclick = () => openGuideDetail(guide);
              
              guideCard.innerHTML = `
                  <div class="flex items-center gap-2">
                      <div class="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-1.5 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors duration-300">
                          <i class="${guide.icon} text-amber-600 dark:text-amber-400 text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-xs mb-0.5 truncate" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}">${guide.title[currentLang]}</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight line-clamp-2" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}">${guide.description[currentLang]}</p>
                      </div>
                      <i class="fas fa-chevron-left text-gray-400 dark:text-gray-500 text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300"></i>
                  </div>
              `;
              
              guidesList.appendChild(guideCard);
          });
          
          // Show/hide the "Show More" button
          if (filteredGuides.length > INITIAL_GUIDES_COUNT) {
              showMoreContainer.classList.remove('hidden');
              updateShowMoreButton(filteredGuides.length);
          } else {
              showMoreContainer.classList.add('hidden');
          }
          
          // Update guides count display
          updateGuidesCountDisplay(filteredGuides.length);
      }
      
      function toggleShowAllGuides() {
          showAllGuides = !showAllGuides;
          renderIslamicGuides();
      }
      
      function updateShowMoreButton(totalFilteredCount) {
          const showMoreBtn = document.getElementById('showMoreGuidesBtn');
          const showMoreText = document.getElementById('showMoreGuidesText');
          const showMoreIcon = document.getElementById('showMoreGuidesIcon');
          
          if (showAllGuides) {
              showMoreText.textContent = currentLang === 'ar' ? 'عرض أقل' : 'Show Less';
              showMoreIcon.className = 'fas fa-chevron-up text-xs';
          } else {
              const remainingCount = totalFilteredCount - INITIAL_GUIDES_COUNT;
              showMoreText.textContent = currentLang === 'ar' ? 
                  `عرض ${remainingCount} أدلة أخرى` : 
                  `Show ${remainingCount} More Guides`;
              showMoreIcon.className = 'fas fa-chevron-down text-xs';
          }
      }
      
      function updateGuidesCountDisplay(count) {
          const countDisplay = document.getElementById('guidesCountDisplay');
          if (countDisplay) {
              if (selectedCategory === 'all') {
                  countDisplay.textContent = currentLang === 'ar' ? 
                      `${count} دليل متاح` : 
                      `${count} guides available`;
              } else {
                  const categoryName = getCategoryDisplayName(selectedCategory);
                  countDisplay.textContent = currentLang === 'ar' ? 
                      `${count} دليل في ${categoryName}` : 
                      `${count} guides in ${categoryName}`;
              }
          }
      }
      
      function getCategoryDisplayName(category) {
          if (!islamicGuidesData) return category;
          
          const guide = islamicGuidesData.guides.find(g => g.category.en.toLowerCase() === category.toLowerCase());
          return guide ? guide.category[currentLang] : category;
      }
      
      function getUniqueCategories() {
          if (!islamicGuidesData) return [];
          
          const categories = new Set();
          islamicGuidesData.guides.forEach(guide => {
              categories.add(guide.category.en);
          });
          
          return Array.from(categories).sort();
      }
      
      function filterGuidesByCategory(category) {
          selectedCategory = category;
          showAllGuides = false; // Reset to show initial count when filtering
          renderIslamicGuides();
          updateCategoryFilterUI();
      }
      
      function updateCategoryFilterUI() {
          const filterBtn = document.getElementById('categoryFilterBtn');
          const filterText = document.getElementById('categoryFilterText');
          
          if (selectedCategory === 'all') {
              filterText.textContent = currentLang === 'ar' ? 'جميع الفئات' : 'All Categories';
          } else {
              filterText.textContent = getCategoryDisplayName(selectedCategory);
          }
      }
      
      function toggleCategoryFilter() {
          const dropdown = document.getElementById('categoryFilterDropdown');
          const isHidden = dropdown.classList.contains('hidden');
          
          if (isHidden) {
              // Populate dropdown before showing
              populateCategoryDropdown();
              dropdown.classList.remove('hidden');
          } else {
              dropdown.classList.add('hidden');
          }
      }
      
      function populateCategoryDropdown() {
          const dropdown = document.getElementById('categoryFilterOptions');
          dropdown.innerHTML = '';
          
          // Add "All Categories" option
          const allOption = document.createElement('button');
          allOption.className = `w-full text-left px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors ${selectedCategory === 'all' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200' : 'text-gray-700 dark:text-gray-300'}`;
          allOption.innerHTML = `
              <div class="flex items-center gap-2">
                  <i class="fas fa-list text-amber-600 dark:text-amber-400"></i>
                  <span>${currentLang === 'ar' ? 'جميع الفئات' : 'All Categories'}</span>
                  ${selectedCategory === 'all' ? '<i class="fas fa-check text-amber-600 dark:text-amber-400 ml-auto"></i>' : ''}
              </div>
          `;
          allOption.onclick = () => {
              filterGuidesByCategory('all');
              toggleCategoryFilter();
          };
          dropdown.appendChild(allOption);
          
          // Add separator
          const separator = document.createElement('div');
          separator.className = 'border-t border-gray-200 dark:border-gray-600 my-1';
          dropdown.appendChild(separator);
          
          // Add category options
          const categories = getUniqueCategories();
          categories.forEach(category => {
              const option = document.createElement('button');
              const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
              option.className = `w-full text-left px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors ${isSelected ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200' : 'text-gray-700 dark:text-gray-300'}`;
              
              const guide = islamicGuidesData.guides.find(g => g.category.en === category);
              const categoryName = guide ? guide.category[currentLang] : category;
              const categoryCount = islamicGuidesData.guides.filter(g => g.category.en === category).length;
              
              option.innerHTML = `
                  <div class="flex items-center gap-2">
                      <i class="${guide ? guide.icon : 'fas fa-book'} text-amber-600 dark:text-amber-400"></i>
                      <span class="flex-1">${categoryName}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">${categoryCount}</span>
                      ${isSelected ? '<i class="fas fa-check text-amber-600 dark:text-amber-400"></i>' : ''}
                  </div>
              `;
              option.onclick = () => {
                  filterGuidesByCategory(category);
                  toggleCategoryFilter();
              };
              dropdown.appendChild(option);
          });
      }

      function toggleIslamicGuides() {
          const content = document.getElementById('islamicGuidesContent');
          const toggleIcon = document.getElementById('guidesToggleIcon');
          const toggleText = document.getElementById('guidesToggleText');
          
          islamicGuidesVisible = !islamicGuidesVisible;
          
          if (islamicGuidesVisible) {
              content.classList.remove('hidden');
              toggleIcon.classList.remove('fa-chevron-down');
              toggleIcon.classList.add('fa-chevron-up');
              toggleText.textContent = currentLang === 'ar' ? 'إخفاء الأدلة' : 'Hide Guides';
              
              if (!islamicGuidesData) {
                  loadIslamicGuides();
              }
          } else {
              content.classList.add('hidden');
              toggleIcon.classList.remove('fa-chevron-up');
              toggleIcon.classList.add('fa-chevron-down');
              toggleText.textContent = currentLang === 'ar' ? 'عرض الأدلة' : 'Show Guides';
          }
      }

      function openGuideDetail(guide) {
          const modal = document.getElementById('guideDetailModal');
          const icon = document.getElementById('guideIcon');
          const title = document.getElementById('guideTitle');
          const description = document.getElementById('guideDescription');
          const steps = document.getElementById('guideSteps');
          
          // Update modal content
          icon.className = guide.icon + ' text-3xl text-amber-600 dark:text-amber-400';
          title.textContent = guide.title[currentLang];
          description.textContent = guide.description[currentLang];
          
          // Clear and populate steps
          steps.innerHTML = '';
          guide.steps.forEach((step, index) => {
              const stepElement = document.createElement('div');
              stepElement.className = 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm';
              
              stepElement.innerHTML = `
                  <div class="flex items-start gap-4">
                      <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          ${index + 1}
                      </div>
                      <div class="flex-1">
                          <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}">${step.title[currentLang]}</h4>
                          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}">${step.description[currentLang]}</p>
                      </div>
                  </div>
              `;
              
              steps.appendChild(stepElement);
          });
          
          // Show modal
          modal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
      }

      function closeGuideDetail() {
          const modal = document.getElementById('guideDetailModal');
          modal.classList.add('hidden');
          document.body.style.overflow = 'auto';
      }

      function updateIslamicGuidesLanguage() {
          const title = document.getElementById('islamicGuidesTitle');
          const desc = document.getElementById('islamicGuidesDesc');
          const toggleText = document.getElementById('guidesToggleText');
          
          if (currentLang === 'ar') {
              title.textContent = 'الأدلة الإسلامية';
              desc.textContent = 'تعلم كيفية أداء العبادات والأعمال الإسلامية بالطريقة الصحيحة';
              toggleText.textContent = islamicGuidesVisible ? 'إخفاء الأدلة' : 'عرض الأدلة';
          } else {
              title.textContent = 'Islamic Guides';
              desc.textContent = 'Learn how to perform Islamic worship and practices correctly';
              toggleText.textContent = islamicGuidesVisible ? 'Hide Guides' : 'Show Guides';
          }
          
          // Re-render guides if they're visible
          if (islamicGuidesVisible && islamicGuidesData) {
              renderIslamicGuides();
          }
          
          // Update category filter and show more button
          updateCategoryFilterUI();
          if (islamicGuidesData) {
              renderIslamicGuides(); // Re-render to update counts and text
          }
      }

      // Daily rotating hadiths collection
      const dailyHadiths = [
          {
              ar: "من قال سبحان الله وبحمده، في يوم مائة مرة، حُطت خطاياه وإن كانت مثل زبد البحر",
              en: "Whoever says 'Glory be to Allah and praise Him' one hundred times a day, his sins will be forgiven even if they are like the foam of the sea",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "من قال لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، في يوم مائة مرة كانت له عدل عشر رقاب",
              en: "Whoever says 'There is no god but Allah alone, with no partner; His is the dominion and His is the praise, and He is able to do all things' one hundred times a day, it will be equivalent to freeing ten slaves",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "من قال حين يصبح: اللهم أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، قالها مائة مرة كان له عدل رقبة",
              en: "Whoever says in the morning: 'O Allah, we have reached the morning and the dominion belongs to Allah, and praise be to Allah. There is no god but Allah alone, with no partner' one hundred times, it will be equivalent to freeing a slave",
              source_ar: "رواه أبو داود",
              source_en: "Narrated by Abu Dawud"
          },
          {
              ar: "من قال بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم ثلاث مرات لم تصبه فجأة بلاء حتى يصبح",
              en: "Whoever says 'In the name of Allah with whose name nothing is harmed on earth nor in heaven, and He is the All-Hearing, All-Knowing' three times, will not be suddenly afflicted by calamity until morning",
              source_ar: "رواه أبو داود والترمذي",
              source_en: "Narrated by Abu Dawud and Tirmidhi"
          },
          {
              ar: "ما من مسلم يقول حين يصبح وحين يمسي ثلاث مرات: رضيت بالله ربا وبالإسلام دينا وبمحمد صلى الله عليه وسلم رسولا، إلا كان حقا على الله أن يرضيه يوم القيامة",
              en: "No Muslim says when he reaches morning and evening three times: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Messenger' except that it becomes Allah's right to please him on the Day of Resurrection",
              source_ar: "رواه أحمد وأبو داود",
              source_en: "Narrated by Ahmad and Abu Dawud"
          },
          {
              ar: "من قال أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه، غفر له وإن كان فر من الزحف",
              en: "Whoever says 'I seek forgiveness from Allah besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him' will be forgiven even if he fled from battle",
              source_ar: "رواه أبو داود والترمذي",
              source_en: "Narrated by Abu Dawud and Tirmidhi"
          },
          {
              ar: "من قال سبحان الله العظيم وبحمده غرست له نخلة في الجنة",
              en: "Whoever says 'Glory be to Allah the Magnificent and praise be to Him' a palm tree will be planted for him in Paradise",
              source_ar: "رواه الترمذي",
              source_en: "Narrated by Tirmidhi"
          },
          {
              ar: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم",
              en: "Two phrases that are light on the tongue, heavy on the scale, and beloved to the Most Merciful: 'Glory be to Allah and praise be to Him, Glory be to Allah the Magnificent'",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "من قال لا حول ولا قوة إلا بالله كانت له دواء من تسعة وتسعين داء أيسرها الهم",
              en: "Whoever says 'There is no power and no strength except in Allah' it will be a cure for ninety-nine ailments, the least of which is worry",
              source_ar: "رواه الحاكم",
              source_en: "Narrated by Al-Hakim"
          },
          {
              ar: "من قرأ آية الكرسي دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت",
              en: "Whoever recites Ayat al-Kursi after each obligatory prayer, nothing prevents him from entering Paradise except death",
              source_ar: "رواه النسائي",
              source_en: "Narrated by An-Nasa'i"
          },
          {
              ar: "من قال حين يأوي إلى فراشه: آمنت بالله الذي لا إله إلا هو، خلق كل شيء وهو بكل شيء عليم، غفر له ما تقدم من ذنبه",
              en: "Whoever says when going to bed: 'I believe in Allah besides whom there is no god, Who created everything and He knows all things' his previous sins will be forgiven",
              source_ar: "رواه ابن السني",
              source_en: "Narrated by Ibn As-Sunni"
          },
          {
              ar: "من قال عند النوم: الحمد لله الذي أطعمنا وسقانا وكفانا وآوانا فكم ممن لا كافي له ولا مؤوي، دخل الجنة",
              en: "Whoever says when sleeping: 'Praise be to Allah Who fed us, gave us drink, sufficed us, and gave us shelter, for how many have no one to suffice them or give them shelter' will enter Paradise",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "الطهور شطر الإيمان، والحمد لله تملأ الميزان، وسبحان الله والحمد لله تملآن أو تملأ ما بين السماوات والأرض",
              en: "Purification is half of faith, 'Praise be to Allah' fills the scale, and 'Glory be to Allah and praise be to Allah' fill what is between the heavens and the earth",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "من قال إذا أصبح: اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر، فقد أدى شكر يومه",
              en: "Whoever says in the morning: 'O Allah, whatever blessing I or any of Your creation have received is from You alone, You have no partner. To You belongs praise and thanks' has fulfilled the gratitude of his day",
              source_ar: "رواه أبو داود",
              source_en: "Narrated by Abu Dawud"
          },
          {
              ar: "من قال ثلاث مرات حين يصبح وحين يمسي: حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم، كفاه الله ما أهمه من أمر الدنيا والآخرة",
              en: "Whoever says three times in the morning and evening: 'Allah is sufficient for me, there is no god but He, in Him I trust and He is the Lord of the Great Throne' Allah will suffice him in all his worldly and otherworldly concerns",
              source_ar: "رواه أبو داود",
              source_en: "Narrated by Abu Dawud"
          },
          {
              ar: "من قال حين يسمع النداء: اللهم رب هذه الدعوة التامة والصلاة القائمة آت محمدا الوسيلة والفضيلة وابعثه مقاما محمودا الذي وعدته، حلت له شفاعتي يوم القيامة",
              en: "Whoever says when hearing the call to prayer: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the praised position You have promised him' my intercession will be lawful for him on the Day of Resurrection",
              source_ar: "رواه البخاري",
              source_en: "Narrated by Bukhari"
          },
          {
              ar: "إن الله يحب إذا عمل أحدكم عملا أن يتقنه",
              en: "Allah loves, when one of you does a job, that he does it with excellence",
              source_ar: "رواه البيهقي",
              source_en: "Narrated by Al-Bayhaqi"
          },
          {
              ar: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف وفي كل خير",
              en: "A strong believer is better and more beloved to Allah than a weak believer, though both are good",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة",
              en: "Whoever relieves a believer of distress in this world, Allah will relieve him of distress on the Day of Resurrection",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "الكلمة الطيبة صدقة",
              en: "A good word is charity",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت",
              en: "Whoever believes in Allah and the Last Day should speak good or remain silent",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "ما ملأ آدمي وعاء شرا من بطن، بحسب ابن آدم أكلات يقمن صلبه، فإن كان لا محالة فثلث لطعامه وثلث لشرابه وثلث لنفسه",
              en: "No human fills a vessel worse than his stomach. It is sufficient for the son of Adam to eat what will support his back. If he must eat more, then one third for food, one third for drink, and one third for air",
              source_ar: "رواه الترمذي",
              source_en: "Narrated by Tirmidhi"
          },
          {
              ar: "من أحب لقاء الله أحب الله لقاءه ومن كره لقاء الله كره الله لقاءه",
              en: "Whoever loves to meet Allah, Allah loves to meet him, and whoever dislikes meeting Allah, Allah dislikes meeting him",
              source_ar: "رواه البخاري ومسلم",
              source_en: "Narrated by Bukhari and Muslim"
          },
          {
              ar: "احرص على ما ينفعك واستعن بالله ولا تعجز",
              en: "Be keen on what benefits you, seek Allah's help, and do not be incapable",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "إن الله لا ينظر إلى صوركم وأموالكم ولكن ينظر إلى قلوبكم وأعمالكم",
              en: "Allah does not look at your forms and wealth, but He looks at your hearts and deeds",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "من عمل عملا ليس عليه أمرنا فهو رد",
              en: "Whoever does a deed that is not in accordance with our matter will have it rejected",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "الدين النصيحة، قلنا لمن؟ قال: لله ولكتابه ولرسوله ولأئمة المسلمين وعامتهم",
              en: "Religion is sincere advice. We said: To whom? He said: To Allah, His Book, His Messenger, and to the leaders and common people of the Muslims",
              source_ar: "رواه مسلم",
              source_en: "Narrated by Muslim"
          },
          {
              ar: "تبسمك في وجه أخيك صدقة",
              en: "Your smile in your brother's face is charity",
              source_ar: "رواه الترمذي",
              source_en: "Narrated by Tirmidhi"
          },
          {
              ar: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن",
              en: "Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character",
              source_ar: "رواه الترمذي",
              source_en: "Narrated by Tirmidhi"
          }
      ];

      // Function to get today's hadith based on the day of the month
      function getTodaysHadith() {
          const today = new Date();
          const dayOfMonth = today.getDate(); // Gets 1-31
          const hadithIndex = (dayOfMonth - 1) % dailyHadiths.length; // Convert to 0-based index and cycle through array
          return dailyHadiths[hadithIndex];
      }

             // Function to update the daily reminder with today's hadith
       function updateDailyReminder() {
           const todaysHadith = getTodaysHadith();
           displayHadith(todaysHadith);
       }

       // Function to display a hadith in the reminder section
       function displayHadith(hadith) {
           const reminderText = document.getElementById('reminderText');
           const reminderSource = document.getElementById('reminderSource');
           
           if (reminderText && reminderSource) {
               if (currentLang === 'ar') {
                   reminderText.textContent = `قال رسول الله ﷺ: "${hadith.ar}"`;
                   reminderSource.textContent = hadith.source_ar;
               } else {
                   reminderText.textContent = `The Prophet ﷺ said: "${hadith.en}"`;
                   reminderSource.textContent = hadith.source_en;
               }
           }
       }

       // Function to generate a random hadith
       function generateRandomHadith() {
           const randomIndex = Math.floor(Math.random() * dailyHadiths.length);
           const randomHadith = dailyHadiths[randomIndex];
           displayHadith(randomHadith);
           
           // Add a subtle animation to indicate change
           const reminderText = document.getElementById('reminderText');
           if (reminderText) {
               reminderText.style.opacity = '0.5';
               setTimeout(() => {
                   reminderText.style.opacity = '1';
               }, 150);
           }
       }

       // Function to load saved language preference
       function loadLanguagePreference() {
           const savedLang = localStorage.getItem('preferredLanguage');
           if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
               currentLang = savedLang;
               tafsirLang = currentLang;
               document.documentElement.lang = currentLang;
               document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
               
               // Set initial search input placeholder
               const searchInput = document.getElementById('quranSearchInput');
               if (searchInput) {
                   searchInput.placeholder = currentLang === 'ar' ? 'البحث في القرآن' : 'Search Quran';
               }
               
               // Set initial surah search input placeholder
               const surahSearchInput = document.getElementById('surahSearchInput');
               if (surahSearchInput) {
                   surahSearchInput.placeholder = currentLang === 'ar' ? 'ابحث عن السورة...' : 'Search surah...';
               }
           }
       }

       // Time format conversion function
       function formatTime(timeString, use24Hour = is24HourFormat) {
           if (!timeString || timeString === '--:--') return timeString;
           
           try {
               const [hours, minutes] = timeString.split(':').map(Number);
               
               if (use24Hour) {
                   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
               } else {
                   // Use Arabic AM/PM for Arabic language
                   const period = hours >= 12 ? (currentLang === 'ar' ? 'مساءً' : 'PM') : (currentLang === 'ar' ? 'صباحاً' : 'AM');
                   const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                   const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')}`;
                   
                   // For Arabic, just return the time with Arabic AM/PM
                   if (currentLang === 'ar') {
                       return `${timeStr} ${period}`;
                   } else {
                       return `${timeStr} ${period}`;
                   }
               }
           } catch (error) {
               console.error('Error formatting time:', error);
               return timeString;
           }
       }

       // Update all displayed prayer times with current format
       function updatePrayerTimeFormat() {
           const timeElements = [
               { selector: "#azan-fajr .font-bold", time: prayerNotifications.Fajr },
               { selector: "#azan-sunrise .font-bold", time: prayerNotifications.Sunrise },
               { selector: "#azan-duha .font-bold", time: prayerNotifications.Duha },
               { selector: "#azan-dhuhr .font-bold", time: prayerNotifications.Dhuhr },
               { selector: "#azan-asr .font-bold", time: prayerNotifications.Asr },
               { selector: "#azan-maghrib .font-bold", time: prayerNotifications.Maghrib },
               { selector: "#azan-isha .font-bold", time: prayerNotifications.Isha }
           ];

           timeElements.forEach(({ selector, time }) => {
               const element = document.querySelector(selector);
               if (element && time) {
                   element.textContent = formatTime(time);
               }
           });
       }

       // Initialize time format toggle
       function initializeTimeFormatToggle() {
           const toggle = document.getElementById('timeFormatToggle');
           if (toggle) {
               toggle.checked = is24HourFormat;
               toggle.addEventListener('change', function() {
                   is24HourFormat = this.checked;
                   localStorage.setItem('is24HourFormat', is24HourFormat.toString());
                   updatePrayerTimeFormat();
                   updateTimeFormatLabel();
               });
           }
           updateTimeFormatLabel();
       }

       // Update time format label
       function updateTimeFormatLabel() {
           const label = document.getElementById('timeFormatLabel');
           if (label) {
               if (currentLang === 'ar') {
                   label.textContent = is24HourFormat ? 'تنسيق الوقت 24 ساعة' : 'تنسيق الوقت 12 ساعة';
               } else {
                   label.textContent = is24HourFormat ? '24-Hour Format' : '12-Hour Format';
               }
           }
       }

       // Initialize first visit tracking
       function initializeFirstVisit() {
           // Don't mark as visited here - only mark after showing Quran tooltips
           if (isFirstVisit) {
               // Show bookmark tooltips on first visit after Quran content loads
               setTimeout(() => {
                   showBookmarkTooltips();
               }, 3000);
           }
       }

       // Initialize single verse loop toggle
       function initializeSingleVerseLoop() {
           const toggle = document.getElementById('singleVerseLoopToggle');
           if (toggle) {
               toggle.checked = isSingleVerseLoop;
               toggle.addEventListener('change', function() {
                   isSingleVerseLoop = this.checked;
                   localStorage.setItem('isSingleVerseLoop', isSingleVerseLoop.toString());
                   
                   // Clear any existing loop timeout
                   if (singleVerseLoopTimeout) {
                       clearTimeout(singleVerseLoopTimeout);
                       singleVerseLoopTimeout = null;
                   }
                   
                   // Update labels
                   updateSingleVerseLoopLabels();
               });
           }
       }

       // Update single verse loop labels based on language
       function updateSingleVerseLoopLabels() {
           const label = document.getElementById('singleVerseLoopLabel');
           const desc = document.getElementById('singleVerseLoopDesc');
           
           if (label && desc) {
               if (currentLang === 'ar') {
                   label.textContent = 'تكرار الآية الواحدة للحفظ';
                   desc.textContent = 'يكرر الآية الحالية باستمرار لمساعدة الحفظ';
               } else {
                   label.textContent = 'Single Verse Loop for Memorization';
                   desc.textContent = 'Repeats current verse continuously to aid memorization';
               }
           }
       }

       // Show bookmark tooltips only on first visit to Quran tab
       function showBookmarkTooltips() {
           // Only show tooltips if this is the first visit to Quran tab
           const isFirstVisitCheck = localStorage.getItem('hasVisitedBefore') !== 'true';
           if (!isFirstVisitCheck) return;
           
           const verseMarkers = document.querySelectorAll('.verse-marker');
           if (verseMarkers.length === 0) return; // No verse markers found
           
           // Mark as visited now that we're showing Quran tooltips
           localStorage.setItem('hasVisitedBefore', 'true');
           isFirstVisit = false;
           
           verseMarkers.forEach(marker => {
               marker.classList.add('show-tooltip');
           });
           
           // Hide tooltips after 5 seconds
           setTimeout(() => {
               verseMarkers.forEach(marker => {
                   marker.classList.remove('show-tooltip');
               });
           }, 5000);
       }

       // Function to handle scroll-based controls visibility
       function handleScrollVisibility() {
         const controls = getQuranControls();
         if (!controls) return;
         
         const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
         
         // Only trigger if we've scrolled enough distance
         if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) {
           return;
         }
         
         // Show controls when scrolling up, hide when scrolling down
         if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
           // Scrolling down - hide controls
           controls.classList.add('quran-controls-hidden');
         } else if (currentScrollTop < lastScrollTop) {
           // Scrolling up - show controls
           controls.classList.remove('quran-controls-hidden');
         }
         
         lastScrollTop = currentScrollTop;
         
         // Clear existing timeout
         if (quranScrollTimeout) {
           clearTimeout(quranScrollTimeout);
         }
         
         // Show controls after scrolling stops
         quranScrollTimeout = setTimeout(() => {
           const controls = getQuranControls();
           if (controls) {
             controls.classList.remove('quran-controls-hidden');
           }
         }, 800);
       }
       
       // Add scroll event listener with throttling to avoid conflicts
       let ticking = false;
       function throttledScrollHandler() {
         if (!ticking) {
           requestAnimationFrame(() => {
             handleScrollVisibility();
             ticking = false;
           });
           ticking = true;
         }
       }
       
       // Initialize scroll handler
       function initScrollHandler() {
         console.log('Initializing scroll handler');
         
         // Remove existing handler if any
         if (scrollHandler) {
           window.removeEventListener('scroll', scrollHandler);
         }
         
         scrollHandler = throttledScrollHandler;
         window.addEventListener('scroll', scrollHandler, { passive: true });
         
         // Show controls on initialization if Quran tab is active
         const controls = getQuranControls();
         console.log('Controls found:', !!controls);
         
         if (controls) {
           const quranTab = document.querySelector('.tab[data-tab="quran"]');
           console.log('Quran tab found:', !!quranTab);
           console.log('Quran tab active:', quranTab?.classList.contains('active'));
           
           if (quranTab && quranTab.classList.contains('active')) {
             controls.style.display = 'flex';
             controls.classList.remove('quran-controls-hidden');
             console.log('Controls should be visible now');
           } else {
             controls.style.display = 'none';
             console.log('Controls hidden - not on Quran tab');
           }
         }
       }

      const languages = {
          ar: {
              title: "Sakinah",
              morning: "أذكار الصباح",
              evening: "أذكار المساء",
              previous: "السابق",
              next: "التالي",
              backText: "العودة",
              langSwitch: "English",
              counter: (i, total) => `الذكر ${i} من ${total}`,
              repeatLabel: "تكرار",
                      swipeHint: "اسحب للتنقل",
              clickHint: "اضغط للعد",
              prayerTitle: "أوقات الصلاة",
              fajr: "الفجر",
              sunrise: "الشروق",
              duha: "الضحى",
              dhuhr: "الظهر",
              asr: "العصر",
              maghrib: "المغرب",
              isha: "العشاء",
              refresh: "تحديث",
              adhkarTab: "الأذكار",
              prayerTab: "أوقات الصلاة",
              qiblaTab: "القبلة",
              tasbihTab: "التسبيح",
              quranTab: "القرآن",
              quranTitle: "القرآن الكريم",
              selectSurah: "اختر السورة",
              arabic: "العربية",
              english: "English",
              locationText: (city, timezone) => `المدينة: ${city} | المنطقة الزمنية: ${timezone}`,
              arErrorTitle: "الواقع المعزز غير مدعوم",
              arErrorMessage: "هذه الميزة تتطلب هاتفاً مزوداً بمستشعرات الحركة",
              fallbackBtnText: "استخدام البوصلة الأساسية",
              calibrationMessage: "حرك الجهاز على شكل رقم 8 لمعايرة البوصلة",
              calibrationDone: "تم",
              alignedMessage: "موجه نحو القبلة",
                            locationTitle: "الموقع الحالي",
                    requestLocationText: "تحديد الموقع",
        startCompassText: "ابدأ البوصلة",
        helpText: "كيفية استخدام البوصلة؟",
        helpModalTitle: "كيفية استخدام البوصلة",
        closeHelpText: "حسناً",
        accuracyHigh: "دقة عالية",
        accuracyMedium: "دقة متوسطة",
        facingQibla: "متجه نحو القبلة ✓",
        closeToQibla: "قريب من القبلة",
        degreeLabel: "الدرجة",
        statusLabel: "الحالة",
        turnRight: "اتجه يميناً",
        calculating: "جاري الحساب...",
        clickStartCompass: "اضغط \"ابدأ البوصلة\" للبدء",
        notConnected: "غير متصل",
        compassInstructions: [
          "1. اضغط على \"ابدأ البوصلة\" للبدء",
          "2. امسك الجهاز بشكل مسطح",
          "3. السهم الأحمر يشير إلى الشمال",
          "4. رمز الكعبة يشير إلى القبلة",
          "5. اتجه حتى يصبح رمز الكعبة في الأعلى"
        ],
        turnLeft: "اتجه يساراً",
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
              notificationLabel: "إشعارات أوقات الصلاة",
            timeFormatLabel: "تنسيق الوقت 24 ساعة",
              bookmarkVerse: "اضغط لتعيين علامة مرجعية",
              translationNames: {
                  // English
                  "en.sahih": "الإنجليزية (صحاح)",
                  "en.pickthall": "الإنجليزية (بيكثال)",
                  "en.yusufali": "الإنجليزية (يوسف علي)",
                  "en.hilali": "الإنجليزية (هلالي-خان)",
                  "en.arberry": "الإنجليزية (آربري)",
                  "en.asad": "الإنجليزية (محمد أسد)",
                  "en.daryabadi": "الإنجليزية (داريابادي)",
                  "en.shakir": "الإنجليزية (شاكر)",
                  // French
                  "fr.hamidullah": "الفرنسية (حميد الله)",
                  "fr.leclerc": "الفرنسية (لوكليرك)",
                  // German
                  "de.bubenheim": "الألمانية (بوبنهايم)",
                  "de.khoury": "الألمانية (خوري)",
                  // Spanish
                  "es.cortes": "الإسبانية (كورتيس)",
                  "es.garcia": "الإسبانية (غارسيا)",
                  // Italian
                  "it.piccardo": "الإيطالية (بيكاردو)",
                  // Portuguese
                  "pt.elhayek": "البرتغالية (الحايك)",
                  // Russian
                  "ru.kuliev": "الروسية (كولييف)",
                  "ru.osmanov": "الروسية (عثمانوف)",
                  // Turkish
                  "tr.diyanet": "التركية (ديانت)",
                  "tr.bulac": "التركية (بولاش)",
                  // Urdu
                  "ur.junagarhi": "الأردية (جونا غاري)",
                  "ur.kanzuliman": "الأردية (كنز الإيمان)",
                  // Indonesian
                  "id.indonesian": "الإندونيسية (وزارة الدين)",
                  // Malay
                  "ms.basmeih": "الماليزية (بسميح)",
                  // Dutch
                  "nl.keyzer": "الهولندية (كيزر)",
                  // Bengali
                  "bn.bengali": "البنغالية (محيالدين خان)",
                  // Chinese
                  "zh.jian": "الصينية المبسطة (جيان)",
                  // Japanese
                  "ja.japanese": "اليابانية (ريوتشي موري)",
                  // Korean
                  "ko.korean": "الكورية (حامد تشوي)",
                  // Hindi
                  "hi.hindi": "الهندية (فاروق خان)",
                  // Tamil
                  "ta.tamil": "التاميلية (جان تراست)",
                  // Persian/Farsi
                  "fa.ansarian": "الفارسية (أنصاريان)",
                  "fa.makarem": "الفارسية (مكارم شيرازي)",
                  // Azerbaijani
                  "az.mammadaliyev": "الأذربيجانية (ممد علييف)",
                  // Albanian
                  "sq.ahmeti": "الألبانية (أحمتي)",
                  // Bosnian
                  "bs.korkut": "البوسنية (كوركوت)",
                  // Czech
                  "cs.hrbek": "التشيكية (هربك)",
                  // Norwegian
                  "no.berg": "النرويجية (برغ)",
                  // Swedish
                  "sv.bernstrom": "السويدية (برنستروم)",
                  // Thai
                  "th.thai": "التايلاندية (الملك فهد)",
                  // Kurdish
                  "ku.asan": "الكردية (آسان)",
                  // Hausa
                  "ha.gumi": "الهوسا (أبو بكر غومي)",
                  // Swahili
                  "sw.barwani": "السواحيلية (بارواني)",
                  // Somali
                  "so.abduh": "الصومالية (عبده)",
                  // Amharic
                  "am.sadiq": "الأمهرية (صادق)",
                  // Yoruba
                  "yo.mikail": "اليوروبا (ميكائيل)"
              },
              azkarTypes: {
                sabah: "أذكار الصباح",
                masaa: "أذكار المساء",
                waking_sleeping: "أدعية الاستيقاظ والنوم",
                home: "أدعية دخول وخروج المنزل",
                bathroom: "أدعية دخول وخروج الحمام",
                eating: "أدعية قبل وبعد الأكل",
                masjid: "أدعية دخول وخروج المسجد",
                traveling: "أدعية السفر",
                clothes: "أدعية لبس الثياب",
                anxiety: "أدعية القلق والحزن",
                hardship: "أدعية الشدة",
                istighfar: "أدعية الاستغفار",
                patience_gratitude: "أدعية الصبر والشكر",
                rabbana: "أدعية ربنا",
                prophetic: "أدعية نبوية",
                prophets: "أدعية الأنبياء",
                rain: "أدعية المطر",
                patient: "أدعية المريض",
                deceased: "أدعية المتوفى",
                marriage_children_rizq: "أدعية الزواج والرزق",
                protection: "أدعية الحماية",
                salah: "أدعية الصلاة",
                sujood_tashahhud: "أدعية السجود والتشهد",
                qunoot: "أدعية القنوت",
                tahajjud: "أدعية التهجد",
                istikhara: "دعاء الاستخارة",
                ramadan: "أدعية رمضان",
                hajj: "أدعية الحج",
                laylat_al_qadr: "أدعية ليلة القدر",
                eid: "أدعية العيد",
                natural_events: "أدعية الظواهر الطبيعية"
              },
              sunrise: "الشروق",
              // Navigation button texts
              previousVerse: "السابق",
              nextVerse: "التالي",
              previousSurah: "السورة السابقة",
              nextSurah: "السورة التالية",
              // Adhkar home page texts
              
              morningCardTitle: "أذكار الصباح",
              morningCardDesc: "ابدأ يومك بالذكر والدعاء",
              eveningCardTitle: "أذكار المساء",
              eveningCardDesc: "اختتم يومك بالذكر والاستغفار",
              moreAdhkarTitle: "المزيد من الأذكار",
              moreAdhkarDesc: "اكتشف جميع أقسام الأذكار",
              tasbihButtonTitle: "التسبيح الرقمي",
              tasbihButtonDesc: "عداد التسبيح والذكر",
              popularCategoriesTitle: "الأذكار الأكثر استخداماً",
              protectionLabel: "أذكار الحماية",
              istighfarLabel: "الاستغفار",
              anxietyLabel: "أذكار القلق",
              prayerLabel: "أذكار الصلاة",
              reminderTitle: "تذكير يومي",
              randomHadithBtn: "حديث آخر",
              // Tasbih translations
              tasbihTitle: "التسبيح الرقمي",
              resetBtn: "إعادة تعيين",
              targetBtn: "تغيير الهدف",
              dailyAdhkarTitle: "الأذكار اليومية",
              dailyAdhkarDesc: "اختر من مجموعة متنوعة من الأذكار والأدعية",
              quickSurahsTitle: "السور الأكثر قراءة",
              quickSurahsDesc: "وصول سريع للسور الأكثر قراءة",
              displayFullSurah: "عرض السورة كاملة",
              autoSwipeLabel: "تلقائي للتالي",
              autoSwipeDesc: "ينتقل تلقائياً للذكر التالي عند الانتهاء"
          },
          en: {
              title: "Sakinah",
              morning: "Morning Azkar",
              evening: "Evening Azkar",
              previous: "Previous",
              next: "Next",
              backText: "Back",
              langSwitch: "العربية",
              counter: (i, total) => `Zikr ${i} of ${total}`,
              repeatLabel: "Repeat",
                      swipeHint: "Swipe to navigate",
              clickHint: "Click to Count",
              prayerTitle: "Prayer Times",
              fajr: "Fajr",
              sunrise: "Sunrise",
              duha: "Duha",
              dhuhr: "Dhuhr",
              asr: "Asr",
              maghrib: "Maghrib",
              isha: "Isha",
              refresh: "Refresh",
              adhkarTab: "Azkar",
              prayerTab: "Prayer Times",
              qiblaTab: "Qibla",
              tasbihTab: "Tasbih",
              quranTab: "Quran",
              quranTitle: "The Holy Quran",
              selectSurah: "Select Surah",
              arabic: "Arabic",
              english: "English",
              locationText: (city, timezone) => `City: ${city} | Timezone: ${timezone}`,
              arErrorTitle: "AR Unsupported",
              arErrorMessage: "This feature requires a mobile device with motion sensors",
              fallbackBtnText: "Use Basic Compass",
              calibrationMessage: "Move your device in a figure-8 pattern to calibrate the compass",
              calibrationDone: "Done",
              alignedMessage: "Aligned with Qibla",
                            locationTitle: "Current Location",
                    requestLocationText: "Detect Location",
        startCompassText: "Start Compass",
        helpText: "How to use compass?",
        helpModalTitle: "How to Use Compass",
        closeHelpText: "OK",
        accuracyHigh: "High Accuracy",
        accuracyMedium: "Medium Accuracy",
        facingQibla: "Facing Qibla ✓",
        closeToQibla: "Close to Qibla",
        degreeLabel: "Degree",
        statusLabel: "Status",
        turnRight: "Turn right",
        calculating: "Calculating...",
        clickStartCompass: "Click 'Start Compass' to begin",
        notConnected: "Not connected",
        compassInstructions: [
          "1. Click 'Start Compass' to begin",
          "2. Hold your device flat",
          "3. The red arrow points to North",
          "4. The Kaaba icon points to Qibla",
          "5. Turn until the Kaaba icon is at the top"
        ],
        turnLeft: "Turn left",
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
              notificationLabel: "Prayer Time Notifications",
            timeFormatLabel: "24-Hour Format",
              bookmarkVerse: "Click to bookmark this verse",
              translationNames: {
                  // English
                  "en.sahih": "English (Sahih Intl)",
                  "en.pickthall": "English (Pickthall)",
                  "en.yusufali": "English (Yusuf Ali)",
                  "en.hilali": "English (Hilali-Khan)",
                  "en.arberry": "English (Arberry)",
                  "en.asad": "English (Muhammad Asad)",
                  "en.daryabadi": "English (Daryabadi)",
                  "en.shakir": "English (Shakir)",
                  // French
                  "fr.hamidullah": "Français (Hamidullah)",
                  "fr.leclerc": "Français (Leclerc)",
                  // German
                  "de.bubenheim": "Deutsch (Bubenheim)",
                  "de.khoury": "Deutsch (Khoury)",
                  // Spanish
                  "es.cortes": "Español (Cortés)",
                  "es.garcia": "Español (García)",
                  // Italian
                  "it.piccardo": "Italiano (Piccardo)",
                  // Portuguese
                  "pt.elhayek": "Português (El Hayek)",
                  // Russian
                  "ru.kuliev": "Русский (Кулиев)",
                  "ru.osmanov": "Русский (Османов)",
                  // Turkish
                  "tr.diyanet": "Türkçe (Diyanet)",
                  "tr.bulac": "Türkçe (Bulaç)",
                  // Urdu
                  "ur.junagarhi": "اردو (جونا گاری)",
                  "ur.kanzuliman": "اردو (کنز الایمان)",
                  // Indonesian
                  "id.indonesian": "Bahasa Indonesia (Kementerian Agama)",
                  // Malay
                  "ms.basmeih": "Bahasa Melayu (Basmeih)",
                  // Dutch
                  "nl.keyzer": "Nederlands (Keyzer)",
                  // Bengali
                  "bn.bengali": "বাংলা (মুহিউদ্দীন খান)",
                  // Chinese
                  "zh.jian": "中文简体 (马坚译)",
                  // Japanese
                  "ja.japanese": "日本語 (森亮一)",
                  // Korean
                  "ko.korean": "한국어 (최하메드)",
                  // Hindi
                  "hi.hindi": "हिन्दी (फारूक खान)",
                  // Tamil
                  "ta.tamil": "தமிழ் (ஜான் டிரஸ்ட்)",
                  // Persian/Farsi
                  "fa.ansarian": "فارسی (انصاریان)",
                  "fa.makarem": "فارسی (مکارم شیرازی)",
                  // Azerbaijani
                  "az.mammadaliyev": "Azərbaycan (Məmmədəliyev)",
                  // Albanian
                  "sq.ahmeti": "Shqip (Ahmeti)",
                  // Bosnian
                  "bs.korkut": "Bosanski (Korkut)",
                  // Czech
                  "cs.hrbek": "Čeština (Hrbek)",
                  // Norwegian
                  "no.berg": "Norsk (Berg)",
                  // Swedish
                  "sv.bernstrom": "Svenska (Bernström)",
                  // Thai
                  "th.thai": "ไทย (สำนักงานพระราชวัง)",
                  // Kurdish
                  "ku.asan": "کوردی (ئاسان)",
                  // Hausa
                  "ha.gumi": "Hausa (Abubakar Gumi)",
                  // Swahili
                  "sw.barwani": "Kiswahili (Barwani)",
                  // Somali
                  "so.abduh": "Soomaali (Abduh)",
                  // Amharic
                  "am.sadiq": "አማርኛ (ሳዲቅ)",
                  // Yoruba
                  "yo.mikail": "Yorùbá (Mikail)"
              },
              azkarTypes: {
                sabah: "Morning Azkar",
                masaa: "Evening Azkar",
                waking_sleeping: "Waking & Sleeping Duas",
                home: "Entering & Leaving Home Duas",
                bathroom: "Entering & Exiting Bathroom Duas",
                eating: "Before & After Eating Duas",
                masjid: "Entering & Exiting Masjid Duas",
                traveling: "Traveling Duas",
                clothes: "Wearing Clothes Duas",
                anxiety: "Duas for Anxiety & Sadness",
                hardship: "Duas in Times of Hardship",
                istighfar: "Seeking Forgiveness (Istighfar)",
                patience_gratitude: "Duas for Patience & Gratitude",
                rabbana: "Rabbana Duas (from the Qur'an)",
                prophetic: "Prophetic Duas from Hadith",
                prophets: "Duas of the Prophets",
                rain: "Duas for Rain / Drought",
                patient: "Duas for the Sick",
                deceased: "Duas for the Deceased",
                marriage_children_rizq: "Duas for Marriage, Children, Rizq",
                protection: "Duas for Protection (Evil Eye, Jinn, Calamity)",
                salah: "Duas before and after Salah",
                sujood_tashahhud: "Duas during Sujood & Tashahhud",
                qunoot: "Duas for Qunoot (Witr prayer)",
                tahajjud: "Duas for Tahajjud",
                istikhara: "Dua for Istikhara (Seeking Guidance)",
                ramadan: "Ramadan Duas",
                hajj: "Dhul Hijjah & Hajj-related Duas",
                laylat_al_qadr: "Laylat al-Qadr Duas",
                eid: "Eid Duas",
                natural_events: "Duas for Natural Events (Rain, Eclipse, Earthquake, etc.)"
              },
              sunrise: "Sunrise",
              // Navigation button texts
              previousVerse: "Previous",
              nextVerse: "Next",
              previousSurah: "Previous Surah",
              nextSurah: "Next Surah",
              // Adhkar home page texts

              morningCardTitle: "Morning Azkar",
              morningCardDesc: "Begin your day with dhikr and dua",
              eveningCardTitle: "Evening Azkar",
              eveningCardDesc: "End your day with dhikr and istighfar",
              moreAdhkarTitle: "More Azkar",
              moreAdhkarDesc: "Discover all sections of azkar",
              tasbihButtonTitle: "Digital Tasbih",
              tasbihButtonDesc: "Dhikr and Tasbih Counter",
              popularCategoriesTitle: "Most Used Azkar",
              protectionLabel: "Protection",
              istighfarLabel: "Forgiveness",
              anxietyLabel: "Anxiety",
              prayerLabel: "Prayer",
              reminderTitle: "Daily Reminder",
              randomHadithBtn: "Another Hadith",
              // Tasbih translations
              tasbihTitle: "Digital Tasbih",
              resetBtn: "Reset",
              targetBtn: "Change Target",
              dailyAdhkarTitle: "Daily Azkar",
              dailyAdhkarDesc: "Choose from a variety of azkar and duas",
              quickSurahsTitle: "Most Read Surahs",
              quickSurahsDesc: "Quick access to commonly read surahs",
              displayFullSurah: "Display full surah",
              autoSwipeLabel: "Auto Next",
              autoSwipeDesc: "Automatically moves to next dhikr when completed"
          }
      };


      // Enhanced prayer times function that can work with coordinates or city
      async function fetchPrayerTimes(cityOrCoords = "Amman", coordinates = null) {
          const today = new Date().toISOString().split('T')[0];
          const formattedDate = today.split('-').reverse().join('-');
          const city = typeof cityOrCoords === 'string' ? cityOrCoords : 'Unknown Location';
          const cacheKey = coordinates ? 
              `prayer-coords-${coordinates.lat.toFixed(4)}-${coordinates.lng.toFixed(4)}-${formattedDate}` :
              `prayer-${city}-${formattedDate}`;
          
          const strategies = [
              async () => {
                  let url;
                  if (coordinates) {
                      // Use coordinates for more accurate prayer times
                      url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${coordinates.lat}&longitude=${coordinates.lng}&method=2`;
                  } else {
                      // Fallback to city-based lookup
                      url = `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(city)}`;
                  }
                  const response = await fetch(url);
                  if (!response.ok) throw new Error(`Direct API failed: ${response.status}`);
                  return response.json();
              },
              
              async () => {
                  const cache = await caches.open('api-cache-v1');
                  const cached = await cache.match(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(city)}`);
                  if (!cached) throw new Error('No cache available');
                  return cached.json();
              },
              
              async () => {
                  const stored = localStorage.getItem(cacheKey);
                  if (!stored) throw new Error('No localStorage data');
                  return JSON.parse(stored);
              }
          ];

          for (const strategy of strategies) {
              try {
                  const data = await strategy();
                  localStorage.setItem(cacheKey, JSON.stringify(data));
                  
                  if (data.code === 200) {
                      const timings = data.data.timings;
                      const location = data.data.meta.timezone;
                      
                      prayerNotifications = timings;
                      savePrayerTimes(timings, location, city);

                      document.getElementById("azan-location").innerText = languages[currentLang].locationText(city, location);
                      // Debug prayer time selectors
                     
                      
                      // Test different selectors for Fajr time
                      const fajrCard = document.getElementById('azan-fajr');
                      if (fajrCard) {
                          const allSpans = fajrCard.querySelectorAll('span');
                          allSpans.forEach((span, index) => {
                          });
                          
                          // Try different selectors
                          const selector1 = fajrCard.querySelector('.flex span:last-child');
                          const selector2 = fajrCard.querySelector('.font-bold');
                          const selector3 = fajrCard.querySelector('span:nth-child(2)');
                     
                      }
                      
                      // Use the working selector for prayer times with formatting
                      const fajrTimeSpan = document.querySelector("#azan-fajr .font-bold");
                      if (fajrTimeSpan) {
                          fajrTimeSpan.innerText = formatTime(timings.Fajr);
                      } else {
                          console.error("Fajr time span not found!");
                      }
                      
                      const sunriseTimeSpan = document.querySelector("#azan-sunrise .font-bold");
                      if (sunriseTimeSpan) sunriseTimeSpan.innerText = formatTime(timings.Sunrise);
                      
                      const dhuhrTimeSpan = document.querySelector("#azan-dhuhr .font-bold");
                      if (dhuhrTimeSpan) dhuhrTimeSpan.innerText = formatTime(timings.Dhuhr);
                      
                      const asrTimeSpan = document.querySelector("#azan-asr .font-bold");
                      if (asrTimeSpan) asrTimeSpan.innerText = formatTime(timings.Asr);
                      
                      const maghribTimeSpan = document.querySelector("#azan-maghrib .font-bold");
                      if (maghribTimeSpan) maghribTimeSpan.innerText = formatTime(timings.Maghrib);
                      
                      const ishaTimeSpan = document.querySelector("#azan-isha .font-bold");
                      if (ishaTimeSpan) ishaTimeSpan.innerText = formatTime(timings.Isha);
                      
                      
                      // Update prayer names after setting times
                      updatePrayerTimesUI();

                      if (notificationEnabled) {
                          setupPrayerNotifications();
                      }
                      return;
                  }
              } catch (error) {
                  continue;
              }
          }

          document.getElementById("azan-location").innerText = languages[currentLang].arErrorMessage;
          throw new Error('All prayer time fetch strategies failed');
      }

            // Simple Compass Initialization
      async function initQiblaCompass() {
          const startBtn = document.getElementById('startCompassBtn');
          const startText = document.getElementById('startCompassText');
          const startOverlay = document.getElementById('compassStartOverlay');
          
          try {
              // Update button to show loading
              startBtn.disabled = true;
              startText.textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
              
              // Check for device orientation support
              if (!('DeviceOrientationEvent' in window)) {
                  throw new Error("orientation_not_supported");
              }

              // For iOS, request motion permission
              const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
              if (isIOS && typeof DeviceOrientationEvent.requestPermission === 'function') {
                  const permission = await DeviceOrientationEvent.requestPermission();
                  if (permission !== 'granted') {
                      throw new Error("motion_permission_denied");
                  }
              }

              // Get user location
              const position = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 60000
                  });
              });

              // Store location and calculate Qibla
              userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              
              qiblaAngle = calculateQiblaAngle(position.coords.latitude, position.coords.longitude);
              updateLocationDisplay(position.coords.latitude, position.coords.longitude);

              // Start compass
              compassActive = true;
              // Remove any previous listeners to avoid duplicates
              window.removeEventListener('deviceorientation', handleCompassOrientation);
              window.removeEventListener('deviceorientationabsolute', handleCompassOrientation);
              if ('ondeviceorientationabsolute' in window) {
                  window.addEventListener('deviceorientationabsolute', handleCompassOrientation, true);
              } else {
                  window.addEventListener('deviceorientation', handleCompassOrientation, true);
              }
              
              // Hide start overlay and show compass
              if (startOverlay) {
                  startOverlay.style.display = 'none';
              }
              
              // Initialize compass display elements
              const alignmentStatus = document.getElementById('alignmentStatus');
              const accuracyIndicator = document.getElementById('accuracyIndicator');
              const accuracyText = document.getElementById('accuracyText');
              
              if (alignmentStatus) {
                  alignmentStatus.textContent = currentLang === 'ar' ? 'متصل' : 'Connected';
                  alignmentStatus.className = 'text-sm font-medium text-green-600 dark:text-green-400 mb-1';
              }
              
              if (accuracyIndicator) {
                  accuracyIndicator.classList.add('status-connected');
              }
              
              if (accuracyText) {
                  accuracyText.textContent = currentLang === 'ar' ? 'متصل' : 'Connected';
              }
              
              updateCompassDisplay();

          } catch (error) {
              console.error("Compass initialization failed:", error);
              startBtn.disabled = false;
              startText.textContent = currentLang === 'ar' ? 'ابدأ البوصلة' : 'Start Compass';
              
              // Show error
              if (error.message === "orientation_not_supported") {
                  showCompassError(currentLang === 'ar' ? 'البوصلة غير مدعومة على هذا الجهاز' : 'Compass not supported on this device');
              } else if (error.message === "motion_permission_denied") {
                  showCompassError(currentLang === 'ar' ? 'يرجى السماح بالوصول إلى مستشعرات الحركة' : 'Please allow motion sensor access');
              } else if (error.code === 1) {
                  showCompassError(currentLang === 'ar' ? 'يرجى السماح بالوصول إلى الموقع' : 'Please allow location access');
              } else {
                  showCompassError(currentLang === 'ar' ? 'حدث خطأ في تشغيل البوصلة' : 'Error starting compass');
              }
          }
      }

      // Enhanced compass orientation handler with better smoothing
      function handleCompassOrientation(event) {
          if (!compassActive) return;

          let heading = 0;
          
          // Check if iOS with accurate webkitCompassHeading
          if (event.webkitCompassHeading !== undefined) {
              // iOS provides accurate magnetic heading
              heading = event.webkitCompassHeading;
          } else if (event.alpha !== null) {
              // For Android and other devices, use alpha
              heading = Math.abs(event.alpha - 360);
          } else {
              return; // No valid orientation data
          }

          // Enhanced smoothing with adaptive factor
          if (smoothedHeading === null) {
              smoothedHeading = heading;
          } else {
              let diff = heading - smoothedHeading;
              // Handle 360/0 degree boundary
              if (diff > 180) diff -= 360;
              if (diff < -180) diff += 360;
              
              // Adaptive smoothing - less smoothing when moving fast, more when stable
              const smoothingFactor = Math.abs(diff) > 10 ? 0.3 : 0.1;
              smoothedHeading = (smoothedHeading + diff * smoothingFactor + 360) % 360;
          }

          currentHeading = smoothedHeading;
          updateCompassDisplay();
      }

      // Update compass display with new rotating compass rose approach
      function updateCompassDisplay() {
          if (!compassActive || typeof qiblaAngle === 'undefined') return;

          const compassRose = document.getElementById('compassRose');
          const degreeDisplay = document.getElementById('degreeDisplay');
          const accuracyIndicator = document.getElementById('accuracyIndicator');
          const accuracyText = document.getElementById('accuracyText');

          // Rotate compass rose to show current heading (opposite direction)
          if (compassRose) {
              compassRose.style.transform = `rotate(${-currentHeading}deg)`;
          }

          // Calculate Qibla direction relative to current heading
          const qiblaRelative = (qiblaAngle - currentHeading + 360) % 360;
          
          // Show current heading in degrees
          if (degreeDisplay) {
              degreeDisplay.textContent = `${Math.round(currentHeading)}°`;
          }

          // Calculate alignment difference for status
          const alignmentDiff = Math.min(qiblaRelative, 360 - qiblaRelative);

          // Add device needle rotation and progress bar
          const deviceNeedle = document.getElementById('deviceNeedle');
          const qiblaIndicator = document.getElementById('qiblaIndicator');
          const alignmentStatus = document.getElementById('alignmentStatus');
          const alignmentProgress = document.getElementById('alignmentProgress');

          // Rotate device needle to show current heading
          if (deviceNeedle) {
              deviceNeedle.style.transform = `rotate(${currentHeading}deg)`;
          }

          // Update progress bar
          if (alignmentProgress) {
              const progressPercent = Math.max(0, 100 - (alignmentDiff / 180 * 100));
              alignmentProgress.style.width = `${progressPercent}%`;
          }

          // Update alignment status with professional animations
          if (alignmentStatus && qiblaIndicator) {
              qiblaIndicator.classList.remove('qibla-indicator-aligned', 'qibla-indicator-close');
              
              if (alignmentDiff <= 5) {
                  alignmentStatus.textContent = languages[currentLang].facingQibla || 'متجه نحو القبلة ✓';
                  alignmentStatus.className = 'text-sm font-medium text-green-600 dark:text-green-400 mb-1';
                  qiblaIndicator.classList.add('qibla-indicator-aligned');
                  
                  // Add haptic feedback when perfectly aligned
                  if (alignmentDiff <= 2 && 'vibrate' in navigator) {
                      navigator.vibrate([100, 50, 100]);
                  }
              } else if (alignmentDiff <= 15) {
                  alignmentStatus.textContent = languages[currentLang].closeToQibla || 'قريب من القبلة';
                  alignmentStatus.className = 'text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1';
                  qiblaIndicator.classList.add('qibla-indicator-close');
              } else {
                  // Calculate turn direction and angle
                  const turnAngle = Math.round(alignmentDiff);
                  const direction = qiblaRelative < 180 ? 
                      (currentLang === 'ar' ? `اتجه يميناً ${turnAngle}°` : `Turn right ${turnAngle}°`) : 
                      (currentLang === 'ar' ? `اتجه يساراً ${turnAngle}°` : `Turn left ${turnAngle}°`);
                  alignmentStatus.textContent = direction;
                  alignmentStatus.className = 'text-sm font-medium text-gray-600 dark:text-gray-400 mb-1';
              }
          }

          // Update accuracy indicator with professional styling
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (accuracyIndicator && accuracyText) {
              accuracyIndicator.classList.remove('status-connected', 'status-high-accuracy', 'status-medium-accuracy', 'status-low-accuracy', 'status-disconnected');
              
              if (isIOS) {
                  accuracyIndicator.classList.add('status-high-accuracy');
                  accuracyText.textContent = currentLang === 'ar' ? 'دقة عالية' : 'High accuracy';
              } else {
                  accuracyIndicator.classList.add('status-medium-accuracy');
                  accuracyText.textContent = currentLang === 'ar' ? 'دقة متوسطة' : 'Medium accuracy';
              }
          }


          

      }

      function calculateQiblaAngle(lat, lng) {
          // Kaaba coordinates
          const kaabaLat = 21.4224779;
          const kaabaLng = 39.8262136;

          // Convert to radians
          const φ1 = lat * Math.PI / 180;
          const φ2 = kaabaLat * Math.PI / 180;
          const Δλ = (kaabaLng - lng) * Math.PI / 180;

          // Calculate bearing
          const y = Math.sin(Δλ) * Math.cos(φ2);
          const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
          
          let bearing = Math.atan2(y, x) * 180 / Math.PI;
          bearing = (bearing + 360) % 360;
          
          return bearing;
      }
      
      // Update location display
      function updateLocationDisplay(lat, lng) {
          const locationInfo = document.getElementById('locationInfo');
          const qiblaDistance = document.getElementById('qiblaDistance');
          
          if (locationInfo) {
              // Simple location display
              locationInfo.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }
          
          if (qiblaDistance) {
              // Calculate distance to Mecca
              const distance = calculateDistanceToMecca(lat, lng);
              qiblaDistance.textContent = currentLang === 'ar' ? 
                  `${distance} كم إلى مكة` : 
                  `${distance} km to Mecca`;
          }
      }

      // Calculate distance to Mecca
      function calculateDistanceToMecca(lat, lng) {
          const kaabaLat = 21.4224779;
          const kaabaLng = 39.8262136;
          
          const R = 6371; // Earth's radius in km
          const dLat = (kaabaLat - lat) * Math.PI / 180;
          const dLng = (kaabaLng - lng) * Math.PI / 180;
          
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat * Math.PI / 180) * Math.cos(kaabaLat * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return Math.round(distance).toLocaleString();
      }

      // Show compass error
      function showCompassError(message) {
          const alignmentStatus = document.getElementById('alignmentStatus');
          if (alignmentStatus) {
              alignmentStatus.textContent = message;
              alignmentStatus.className = 'text-sm font-medium text-red-600 dark:text-red-400 mb-1';
          }
      }

      // Stop compass function
      function stopCompass() {
          compassActive = false;
          window.removeEventListener('deviceorientation', handleCompassOrientation);
          window.removeEventListener('deviceorientationabsolute', handleCompassOrientation);
          
          // Reset overlay
          const startOverlay = document.getElementById('compassStartOverlay');
          const startBtn = document.getElementById('startCompassBtn');
          const startText = document.getElementById('startCompassText');
          
          if (startOverlay) {
              startOverlay.style.display = 'flex';
          }
          if (startBtn) {
              startBtn.disabled = false;
          }
          if (startText) {
              startText.textContent = currentLang === 'ar' ? 'ابدأ البوصلة' : 'Start Compass';
          }
          
          // Reset status
          const alignmentStatus = document.getElementById('alignmentStatus');
          const accuracyText = document.getElementById('accuracyText');
          const degreeDisplay = document.getElementById('degreeDisplay');
          
          if (alignmentStatus) {
              alignmentStatus.textContent = currentLang === 'ar' ? 'غير متصل' : 'Disconnected';
              alignmentStatus.className = 'text-sm font-medium text-gray-600 dark:text-gray-400 mb-1';
          }
          if (accuracyText) {
              accuracyText.textContent = currentLang === 'ar' ? 'غير متصل' : 'Disconnected';
          }
          if (degreeDisplay) {
              degreeDisplay.textContent = '--°';
          }
      }

      // Show compass help modal
      function showCompassHelp() {
          updateCompassHelpContent();
          const modal = document.getElementById('compassHelpModal');
          if (modal) {
              modal.classList.remove('hidden');
          }
      }
      
      // Update compass help modal content based on current language
      function updateCompassHelpContent() {
          const helpModalContent = document.getElementById('helpModalContent');
          if (helpModalContent) {
              const instructions = languages[currentLang].compassInstructions;
              helpModalContent.innerHTML = instructions.map(instruction => `<p>${instruction}</p>`).join('');
          }
      }

      // Close compass help modal
      function closeCompassHelp() {
          const modal = document.getElementById('compassHelpModal');
          if (modal) {
              modal.classList.add('hidden');
          }
      }
      
      // Update compass UI elements when language changes
      function updateCompassUI() {
          const directionStatus = document.getElementById('directionStatus');
          const accuracyText = document.getElementById('accuracyText');
          const qiblaDistance = document.getElementById('qiblaDistance');
          const locationInfo = document.getElementById('locationInfo');
          
          // Update default text if compass is not active
          if (!compassActive) {
              if (directionStatus) {
                  directionStatus.textContent = languages[currentLang].clickStartCompass;
              }
              if (accuracyText) {
                  accuracyText.textContent = languages[currentLang].notConnected;
              }
              if (qiblaDistance && (qiblaDistance.textContent.includes('جاري الحساب') || qiblaDistance.textContent.includes('Calculating'))) {
                  qiblaDistance.textContent = languages[currentLang].calculating;
              }
          }
          
          // Update compass help modal content
          updateCompassHelpContent();
          
          // If compass is active, update display
          if (compassActive) {
              updateCompassDisplay();
          }
      }



      // Add event listener for refresh location button
      document.getElementById('refreshLocationBtn').addEventListener('click', async () => {
          const btn = document.getElementById('refreshLocationBtn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin text-sm"></i>';
          
          try {
              const position = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 0
                  });
              });
              
              userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              
              qiblaAngle = calculateQiblaAngle(position.coords.latitude, position.coords.longitude);
              updateLocationDisplay(position.coords.latitude, position.coords.longitude);
              
              if (compassActive) {
                  updateCompassDisplay();
              }
              
          } catch (error) {
              showCompassError(currentLang === 'ar' ? 'فشل في تحديث الموقع' : 'Failed to update location');
          } finally {
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-location-arrow text-sm"></i>';
          }
      });

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
          if (typeof qiblaAngle === 'undefined' || typeof currentHeading === 'undefined') {
              return;
          }
          
          const relativeAngle = (qiblaAngle - currentHeading + 360) % 360;
          const degreeDisplay = document.getElementById('degreeValue');
          const alignmentRings = document.getElementById('alignmentRings');
          const alignmentDot = document.getElementById('alignmentDot');
          const alignmentText = document.getElementById('alignmentText');
          const directionArrow = document.getElementById('directionArrow');
          const kaabaGlow = document.getElementById('kaabaGlow');
          
          if (!degreeDisplay) return;
          
          // More precise alignment detection (within 5 degrees)
          const isAligned = Math.abs(relativeAngle) <= 5 || Math.abs(relativeAngle - 360) <= 5;
          const isVeryClose = Math.abs(relativeAngle) <= 2 || Math.abs(relativeAngle - 360) <= 2;
          
          // Update direction arrow rotation
          if (directionArrow) {
              directionArrow.style.transform = `rotate(${relativeAngle}deg)`;
          }
          
          if (isAligned) {
              degreeDisplay.textContent = languages[currentLang].alignedMessage || 'Aligned with Qibla';
              degreeDisplay.parentElement.style.backgroundColor = 'rgba(34, 197, 94, 0.8)'; // Green background
              
              // Show alignment rings
              if (alignmentRings) alignmentRings.style.opacity = '1';
              if (kaabaGlow) kaabaGlow.style.opacity = isVeryClose ? '0.8' : '0.4';
              
              // Update alignment status
              if (alignmentDot) {
                  alignmentDot.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';
              }
              if (alignmentText) {
                  alignmentText.textContent = isVeryClose ? 
                      (currentLang === 'ar' ? 'محاذي للقبلة تماماً!' : 'Perfectly Aligned!') :
                      (currentLang === 'ar' ? 'قريب من القبلة' : 'Close to Qibla');
              }
              
              // Haptic feedback when aligned
              if ('vibrate' in navigator && isVeryClose) {
                  navigator.vibrate([50, 100, 50]);
              }
          } else {
              // Round to nearest degree for stability
              const roundedAngle = Math.round(relativeAngle);
              degreeDisplay.textContent = `${roundedAngle}°`;
              degreeDisplay.parentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              
              // Hide alignment rings and glow
              if (alignmentRings) alignmentRings.style.opacity = '0';
              if (kaabaGlow) kaabaGlow.style.opacity = '0';
              
              // Update alignment status
              if (alignmentDot) {
                  alignmentDot.className = 'w-2 h-2 bg-red-400 rounded-full';
              }
              if (alignmentText) {
                  const distance = Math.min(relativeAngle, 360 - relativeAngle);
                  if (distance > 45) {
                      alignmentText.textContent = currentLang === 'ar' ? 'ابحث عن القبلة' : 'Finding Qibla';
                  } else {
                      alignmentText.textContent = currentLang === 'ar' ? 'اقترب من القبلة' : 'Getting closer';
                  }
              }
          }
          
          // Debug info (remove in production)
      }
      
      function updateAccuracyIndicator(isHighAccuracy) {
          const accuracyIndicator = document.getElementById('accuracyIndicator');
          if (!accuracyIndicator) return;
          
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          if (isHighAccuracy && isIOS) {
              accuracyIndicator.innerHTML = '<i class="fas fa-check-circle text-green-400 mr-1"></i>' + 
                  (currentLang === 'ar' ? 'دقة عالية' : 'High Accuracy');
              accuracyIndicator.className = 'text-green-400';
          } else {
              accuracyIndicator.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-400 mr-1"></i>' + 
                  (currentLang === 'ar' ? 'دقة متوسطة - قم بمعايرة البوصلة' : 'Medium Accuracy - Calibrate Compass');
              accuracyIndicator.className = 'text-yellow-400';
          }
      }

      function startARRenderLoop() {
          const video = document.getElementById('arCamera');
          const canvas = document.getElementById('arCanvas');
          const ctx = canvas.getContext('2d');
          const kaabaIndicator = document.getElementById('kaabaIndicator');
          const compassRose = document.getElementById('compassRose');

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

              if (typeof qiblaAngle === 'undefined' || typeof currentHeading === 'undefined') {
                  animationFrameId = requestAnimationFrame(render);
                  return;
              }

              const relativeAngle = (qiblaAngle - currentHeading + 360) % 360;
              const rad = relativeAngle * Math.PI / 180;

              const centerX = displayWidth / 2;
              const centerY = displayHeight / 2;

              // Clear canvas for additional drawing
              ctx.clearRect(0, 0, displayWidth, displayHeight);

              // Rotate compass rose based on device heading
              if (compassRose) {
                  compassRose.style.transform = `rotate(${-currentHeading}deg)`;
                  // Show compass rose when not aligned for better orientation
                  const isAligned = Math.abs(relativeAngle) <= 5 || Math.abs(relativeAngle - 360) <= 5;
                  compassRose.style.opacity = isAligned ? '0.1' : '0.3';
              }

              // Position Kaaba indicator
              const radius = Math.min(centerX, centerY) * 0.6; // Slightly larger radius
              let kaabaX = centerX + Math.sin(rad) * radius;
              let kaabaY = centerY - Math.cos(rad) * radius;

              // Keep Kaaba indicator within bounds with more margin
              const margin = 64; // Increased margin for larger indicator
              kaabaX = Math.max(margin, Math.min(displayWidth - margin, kaabaX));
              kaabaY = Math.max(margin, Math.min(displayHeight - margin, kaabaY));

              // Update Kaaba indicator position
              if (kaabaIndicator) {
                  kaabaIndicator.style.transform = `translate(${kaabaX - 32}px, ${kaabaY - 32}px)`;
                  
                  // Update distance indicator
                  const distanceSpan = document.getElementById('qiblaDistance');
                  if (distanceSpan && typeof userLocation !== 'undefined') {
                      const distance = calculateDistance(userLocation.lat, userLocation.lng, 21.4224779, 39.8262136);
                      distanceSpan.textContent = `${distance.toFixed(0)} km`;
                  }
              }

              // Draw directional line from center to Qibla when far from alignment
              const isAligned = Math.abs(relativeAngle) <= 10 || Math.abs(relativeAngle - 360) <= 10;
              if (!isAligned) {
                  ctx.beginPath();
                  ctx.setLineDash([10, 10]);
                  ctx.moveTo(centerX, centerY);
                  ctx.lineTo(kaabaX, kaabaY);
                  ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  ctx.setLineDash([]);
              }

              animationFrameId = requestAnimationFrame(render);
          }

          // Initialize with smooth transitions
          if (kaabaIndicator) {
              kaabaIndicator.style.opacity = '1';
              kaabaIndicator.style.transition = 'opacity 0.5s, transform 0.3s ease-out';
          }
          
          render();
      }
      
             // Helper function to calculate distance between two coordinates
       function calculateDistance(lat1, lng1, lat2, lng2) {
           const R = 6371; // Earth's radius in kilometers
           const dLat = (lat2 - lat1) * Math.PI / 180;
           const dLng = (lng2 - lng1) * Math.PI / 180;
           const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                     Math.sin(dLng/2) * Math.sin(dLng/2);
           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
           return R * c;
       }
       
       // Update location display with city/country info
       function updateLocationDisplay(lat, lng) {
           const locationInfo = document.getElementById('locationInfo');
           if (!locationInfo) return;
           
           // Show coordinates initially
           locationInfo.textContent = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
           
           // Try to get city name using reverse geocoding (optional)
           // This is a simple approximation - in production, use a proper geocoding service
           const cityName = getCityName(lat, lng);
           if (cityName) {
               locationInfo.textContent = cityName;
           }
       }
       
       // Simple city name approximation (replace with proper geocoding service)
       function getCityName(lat, lng) {
           // Major cities approximation - in production, use a proper geocoding API
           const cities = [
               { name: "Mecca, Saudi Arabia", lat: 21.4225, lng: 39.8262, radius: 50 },
               { name: "Medina, Saudi Arabia", lat: 24.4539, lng: 39.6031, radius: 50 },
               { name: "Riyadh, Saudi Arabia", lat: 24.7136, lng: 46.6753, radius: 100 },
               { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, radius: 100 },
               { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357, radius: 100 },
               { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784, radius: 100 },
               { name: "London, UK", lat: 51.5074, lng: -0.1278, radius: 100 },
               { name: "New York, USA", lat: 40.7128, lng: -74.0060, radius: 100 },
               { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, radius: 100 },
               { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832, radius: 100 },
           ];
           
           for (const city of cities) {
               const distance = calculateDistance(lat, lng, city.lat, city.lng);
               if (distance < city.radius) {
                   return city.name;
               }
           }
           
           return null;
      }

// Legacy function for compatibility - simplified for basic compass
function showARUnsupported(errorType) {
    // For backward compatibility, just show a simple error
    showCompassError(currentLang === 'ar' ? 'حدث خطأ في البوصلة' : 'Compass error occurred');
}

      // Legacy functions for compatibility
      function showCalibrationPrompt() {
          // No longer needed with simple compass
      }

      function dismissCalibrationPrompt() {
          // No longer needed with simple compass
      }

      // Legacy function for compatibility
      function initCompassFallback() {
          initQiblaCompass();
      }

      // Test function to validate qibla accuracy for known locations
      function testQiblaAccuracy() {
          const testLocations = [
              { name: "Amman, Jordan", lat: 31.9454, lng: 35.9284, expectedBearing: 157 },
              { name: "London, UK", lat: 51.5074, lng: -0.1278, expectedBearing: 119 },
              { name: "New York, USA", lat: 40.7128, lng: -74.0060, expectedBearing: 58 },
              { name: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456, expectedBearing: 295 },
              { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357, expectedBearing: 135 }
          ];
          
          testLocations.forEach(location => {
              const calculated = calculateQiblaAngle(location.lat, location.lng);
              const difference = Math.abs(calculated - location.expectedBearing);
              const accuracy = difference <= 2 ? "✅ ACCURATE" : difference <= 5 ? "⚠️ CLOSE" : "❌ INACCURATE";
          });
      }
      
             // Call test function (remove in production)
       // testQiblaAccuracy();

           
       
       // Add to global scope for console testing
       window.requestNotificationPermission = requestNotificationPermission;
       window.testQiblaAccuracy = testQiblaAccuracy;
       

       

       

       

       


      // Samsung-specific retry function
      async function retrySamsungInit() {
          
          try {
              // Force request permissions again
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              stream.getTracks().forEach(track => track.stop());
              
              // Try with different geolocation options
              const position = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: false, // Try with lower accuracy first
                      timeout: 20000,
                      maximumAge: 60000 // Allow cached location
                  });
              });
              
              
              // Wait a bit then retry full initialization
              setTimeout(() => {
                  initQiblaCompass();
              }, 1000);
              
          } catch (error) {
              console.error("Samsung retry failed:", error);
              showCompassError(currentLang === 'ar' ? 'فشل في إعادة المحاولة' : 'Retry failed');
          }
      }

            // Initialize location on page load
      async function initializeQiblaLocation() {
          try {
              const position = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 300000 // 5 minutes cache
                  });
              });
              
           
              
              userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              
              qiblaAngle = calculateQiblaAngle(position.coords.latitude, position.coords.longitude);
              updateLocationDisplay(position.coords.latitude, position.coords.longitude);
              
              
          } catch (error) {
              // Show default message
              const locationInfo = document.getElementById('locationInfo');
              const qiblaDistance = document.getElementById('qiblaDistance');
              
              if (locationInfo) {
                  locationInfo.textContent = currentLang === 'ar' ? 'اضغط على الزر لتحديد الموقع' : 'Click button to detect location';
              }
              if (qiblaDistance) {
                  qiblaDistance.textContent = languages[currentLang].calculating;
              }
              
              // Update direction status and accuracy text
              const directionStatus = document.getElementById('directionStatus');
              const accuracyText = document.getElementById('accuracyText');
              
              if (directionStatus) {
                  directionStatus.textContent = languages[currentLang].clickStartCompass;
              }
              if (accuracyText) {
                  accuracyText.textContent = languages[currentLang].notConnected;
              }
          }
      }

      // Event Listeners
      document.getElementById('startCompassBtn').addEventListener('click', initQiblaCompass);
      
 

      function handleDhikrClick() {
          const arabicText = document.getElementById('adhkarArabicText');
          const counterNumber = document.getElementById('dhikrCountNumber');
          const progressRing = document.getElementById('dhikrProgressRing');
          const dhikrCard = arabicText.closest('.bg-gradient-to-br');

          if (filteredAdhkar[current].remainingRepeats > 0) {
              filteredAdhkar[current].remainingRepeats--;
              
              // Calculate current count and total
              const totalRepeats = filteredAdhkar[current].repeat;
              const currentCount = totalRepeats - filteredAdhkar[current].remainingRepeats;
              const progress = (currentCount / totalRepeats) * 100;
              
              // Update counter number directly without animation
              counterNumber.textContent = currentCount;
              
              // Update progress ring
              updateProgressRing(progressRing, progress);
              
              // Check if completed
              if (filteredAdhkar[current].remainingRepeats === 0) {
                  setTimeout(() => {
                      celebrateCompletion();
                  }, 300);
              }
              
              updateRepeatCounter();
          }
      }



      function updateProgressRing(ringElement, progress) {
          const circumference = 2 * Math.PI * 40; // radius = 40
          const offset = circumference - (progress / 100) * circumference;
          ringElement.style.strokeDashoffset = offset;
          
          // Change color based on progress
          if (progress >= 100) {
              ringElement.classList.remove('text-blue-500', 'dark:text-blue-400');
              ringElement.classList.add('text-green-500', 'dark:text-green-400');
          } else if (progress >= 75) {
              ringElement.classList.remove('text-blue-500', 'dark:text-blue-400');
              ringElement.classList.add('text-yellow-500', 'dark:text-yellow-400');
          }
      }

      function celebrateCompletion() {
          const counterNumber = document.getElementById('dhikrCountNumber');
          const progressRing = document.getElementById('dhikrProgressRing');
          
          // Change counter color to green without animation
          counterNumber.style.color = '#10b981'; // Green color
          
          // Apply color pulse effect to the progress ring
          if (progressRing) {
              progressRing.classList.add('progress-ring-complete');
              
              // Remove the animation class after animation completes
              setTimeout(() => {
                  progressRing.classList.remove('progress-ring-complete');
              }, 1500);
          }
          
          // Play success sound if available
          if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
          }
          
          // Auto-swipe to next dhikr if enabled and not at the last dhikr
          if (autoSwipeEnabled && current < filteredAdhkar.length - 1) {
              setTimeout(() => {
                  nextDhikr();
                  // Show toast notification
                 
              }, 1500); // Wait for celebration animation to complete
          }
      }



      function updateRepeatCounter() {
          document.getElementById('repeatValue').innerText = filteredAdhkar[current].remainingRepeats;
      }

      // Auto-swipe toggle functions
      function toggleAutoSwipe() {
          const toggle = document.getElementById('autoSwipeToggle');
          autoSwipeEnabled = toggle.checked;
          
          // Save preference to localStorage
          localStorage.setItem('autoSwipeEnabled', autoSwipeEnabled);
          
          // Show feedback
          const message = autoSwipeEnabled 
              ? (currentLang === 'ar' ? 'تم تفعيل الانتقال التلقائي' : 'Auto-swipe enabled')
              : (currentLang === 'ar' ? 'تم إلغاء الانتقال التلقائي' : 'Auto-swipe disabled');
          showToast(message, 'info');
      }

      function loadAutoSwipePreference() {
          const saved = localStorage.getItem('autoSwipeEnabled');
          if (saved !== null) {
              autoSwipeEnabled = saved === 'true';
              const toggle = document.getElementById('autoSwipeToggle');
              if (toggle) {
                  toggle.checked = autoSwipeEnabled;
              }
          }
      }

      function switchLanguage() {
          currentLang = currentLang === 'ar' ? 'en' : 'ar';
          tafsirLang = currentLang;
          
          // Save language preference to localStorage
          localStorage.setItem('preferredLanguage', currentLang);
          
          document.documentElement.lang = currentLang;
          document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
          
          // Use setTimeout to ensure DOM updates are processed
          setTimeout(() => {
          updateUI();
          updateSettingsLanguage();
              updateReciterOptions();
          displayDhikr();
          updatePrayerTimesUI();
          updatePrayerTimeFormat(); // Update prayer time format with new language
          updateCompassUI();
          updatePrayerSettingsLanguage();
          updatePrayerOffsetsLanguage();
          updateComingPrayerIndicator(); // Update coming prayer indicator with new language
          updateVideoLanguage(); // Update video generator language
          updateMainTabLanguage(); // Update main tab names
          }, 0);
          
          // Update Surah dropdown with appropriate language names
          updateSurahDropdown();
          
          // Update Quran display if we're in the Quran tab
          if (document.getElementById('quranContent').classList.contains('active')) {
              // Force a refresh of the current display
              if (currentSurah !== null) {
                  if (isReadingMode) {
                      loadReadingModeAyahs();
                  } else {
                      displayAyah();
                  }
              } else {
                  // If no surah is selected, reset the content to update the continue reading section
                  resetQuranContent();
              }
          }
          
          // Update tutorial if it's visible
          const modal = document.getElementById('tutorialModal');
          if (!modal.classList.contains('hidden')) {
              showTutorial();
          }

          // Update page/Juz indicator language if visible
          const pageJuzIndicator = document.getElementById('pageJuzIndicator');
          if (pageJuzIndicator && !pageJuzIndicator.classList.contains('hidden')) {
              // Use stored values to update language immediately, then re-detect
              if (currentPageNum && currentJuzNum) {
                  updatePageJuzIndicator(currentPageNum, currentJuzNum);
              }
              // Also re-detect to ensure accuracy
              setTimeout(() => {
                  if (isReadingMode && currentSurah !== null) {
                      detectCurrentPageAndJuz();
                  }
              }, 100);
          }
      }

      function updateUI() {
          const lang = languages[currentLang];
          const elements = {
              'pageTitle': lang.title,
              'btnPrev': lang.previous,
              'btnNext': lang.next,

              'langToggle': lang.langSwitch,
              'repeatLabel': lang.repeatLabel,
              'swipeHintText': lang.swipeHint,
              'clickHintText': lang.clickHint,
              'adhkarTab': lang.adhkarTab,
              'prayerTab': lang.prayerTab,
              'qiblaTab': lang.qiblaTab,
        'locationTitle': lang.locationTitle,
        'requestLocationText': lang.requestLocationText,
        'startCompassText': lang.startCompassText,
        'helpText': lang.helpText,
        'helpModalTitle': lang.helpModalTitle,
        'closeHelpText': lang.closeHelpText,
        'troubleshootText': lang.troubleshootText,
              'tasbihTab': lang.tasbihTab,
              'quranTab': lang.quranTab,
              'notificationLabel': lang.notificationLabel,
            'timeFormatLabel': lang.timeFormatLabel,
              'quranTitle': lang.quranTitle,
              'surahMenuTitle': lang.selectSurah,
              // Adhkar home page elements
              
              'morningCardTitle': lang.morningCardTitle,
              'morningCardDesc': lang.morningCardDesc,
              'eveningCardTitle': lang.eveningCardTitle,
              'eveningCardDesc': lang.eveningCardDesc,
              'moreAdhkarTitle': lang.moreAdhkarTitle,
              'moreAdhkarDesc': lang.moreAdhkarDesc,
              'tasbihButtonTitle': lang.tasbihButtonTitle,
              'tasbihButtonDesc': lang.tasbihButtonDesc,
              'popularCategoriesTitle': lang.popularCategoriesTitle,
              'protectionLabel': lang.protectionLabel,
              'istighfarLabel': lang.istighfarLabel,
              'anxietyLabel': lang.anxietyLabel,
              'prayerLabel': lang.prayerLabel,
              'reminderTitle': lang.reminderTitle,
              'randomHadithBtn': lang.randomHadithBtn,
              // Tasbih elements
              'tasbihTitle': lang.tasbihTitle,
              'resetBtn': lang.resetBtn,
              'targetBtn': lang.targetBtn,
              'dailyAdhkarTitle': lang.dailyAdhkarTitle,
              'dailyAdhkarDesc': lang.dailyAdhkarDesc,
              'quickSurahsTitle': lang.quickSurahsTitle,
              'quickSurahsDesc': lang.quickSurahsDesc,
              'autoSwipeLabel': lang.autoSwipeLabel,
              'autoSwipeDesc': lang.autoSwipeDesc

          };
          
          // Update reading mode button tooltip if in single verse mode
          const readingModeBtn = document.getElementById('btnReadingMode');
          if (readingModeBtn && !isReadingMode && currentSurah !== null && readingModeBtn.classList.contains('show-tooltip')) {
              readingModeBtn.setAttribute('data-tooltip', lang.displayFullSurah);
          }

          // Update each element if it exists
          for (const [id, text] of Object.entries(elements)) {
              const element = document.getElementById(id);
              if (element) {
                  element.innerText = text;
              }
          }

          // Update azkar type labels in modal
          const azkarTypeLabels = {
              'labelWakingSleeping': lang.azkarTypes.waking_sleeping,
              'labelHome': lang.azkarTypes.home,
              'labelBathroom': lang.azkarTypes.bathroom,
              'labelEating': lang.azkarTypes.eating,
              'labelMasjid': lang.azkarTypes.masjid,
              'labelTraveling': lang.azkarTypes.traveling,
              'labelClothes': lang.azkarTypes.clothes,
              'labelAnxiety': lang.azkarTypes.anxiety,
              'labelHardship': lang.azkarTypes.hardship,
              'labelIstighfar': lang.azkarTypes.istighfar,
              'labelPatienceGratitude': lang.azkarTypes.patience_gratitude,
              'labelRabbana': lang.azkarTypes.rabbana,
              'labelProphetic': lang.azkarTypes.prophetic,
              'labelProphets': lang.azkarTypes.prophets,
              'labelRain': lang.azkarTypes.rain,
              'labelPatient': lang.azkarTypes.patient,
              'labelDeceased': lang.azkarTypes.deceased,
              'labelMarriageChildrenRizq': lang.azkarTypes.marriage_children_rizq,
              'labelProtection': lang.azkarTypes.protection,
              'labelSalah': lang.azkarTypes.salah,
              'labelSujoodTashahhud': lang.azkarTypes.sujood_tashahhud,
              'labelQunoot': lang.azkarTypes.qunoot,
              'labelTahajjud': lang.azkarTypes.tahajjud,
              'labelIstikhara': lang.azkarTypes.istikhara,
              'labelRamadan': lang.azkarTypes.ramadan,
              'labelHajj': lang.azkarTypes.hajj,
              'labelLaylatAlQadr': lang.azkarTypes.laylat_al_qadr,
              'labelEid': lang.azkarTypes.eid,
              'labelNaturalEvents': lang.azkarTypes.natural_events
          };

          for (const [id, text] of Object.entries(azkarTypeLabels)) {
              const element = document.getElementById(id);
              if (element && text) {
                  element.innerText = text;
              }
          }

          // Update daily reminder with today's hadith
          updateDailyReminder();
          
          // Update Islamic guides language
          updateIslamicGuidesLanguage();

          // Update arrow directions based on language
          const arrowIcons = document.querySelectorAll('.arrow-icon');
          arrowIcons.forEach(arrow => {
              arrow.className = arrow.className.replace(/fa-chevron-(left|right)/, '');
              if (currentLang === 'ar') {
                  arrow.classList.add('fa-chevron-left');
              } else {
                  arrow.classList.add('fa-chevron-right');
              }
          });
          
          // Update back arrow directions based on language
          const backArrows = document.querySelectorAll('.back-arrow');
          backArrows.forEach(arrow => {
              arrow.className = arrow.className.replace(/fa-arrow-(left|right)/, '');
              if (currentLang === 'ar') {
                  arrow.classList.add('fa-arrow-right');
              } else {
                  arrow.classList.add('fa-arrow-left');
              }
          });
          
          // Update back button text
          const backText = document.getElementById('backText');
          if (backText) {
              backText.textContent = lang.backText;
          }
          
          // Update Hijri date when language changes
          updateHijriDate();
          
          // Update search input placeholder
          const searchInput = document.getElementById('quranSearchInput');
          if (searchInput) {
              searchInput.placeholder = currentLang === 'ar' ? 'البحث في القرآن' : 'Search Quran';
          }
          
          // Update surah search input placeholder
          const surahSearchInput = document.getElementById('surahSearchInput');
          if (surahSearchInput) {
              surahSearchInput.placeholder = currentLang === 'ar' ? 'ابحث عن السورة...' : 'Search surah...';
          }

          // Update language toggle button with both desktop and mobile text
          const langToggle = document.getElementById('langToggle');
          if (langToggle) {
              const langText = currentLang === 'ar' ? 'English' : 'عربي';
              const langShort = currentLang === 'ar' ? 'EN' : 'ع';
              const desktopSpan = langToggle.querySelector('.hidden.sm\\:inline');
              const mobileSpan = langToggle.querySelector('.sm\\:hidden');
              if (desktopSpan) desktopSpan.textContent = langText;
              if (mobileSpan) mobileSpan.textContent = langShort;
          }

          // Special case for btnRefresh which has an icon
          const btnRefresh = document.getElementById('btnRefresh');
          if (btnRefresh) {
              btnRefresh.innerHTML = `<i class="fas fa-sync-alt mr-2"></i> ${lang.refresh}`;
          }

          // Update surah menu button text
          updateSurahDropdown();
          
          // Update translation select options
          const translationSelect = document.getElementById('translationSelect');
          if (translationSelect) {
          const currentTranslation = translationSelect.value;
          translationSelect.innerHTML = '';
          
              // Add options based on current language - organized by language groups
              const translationOptions = [
                  // English Translations
                  { value: "en.sahih", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.pickthall", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.yusufali", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.hilali", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.arberry", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.asad", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.daryabadi", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  { value: "en.shakir", group: currentLang === 'ar' ? "الإنجليزية" : "English" },
                  
                  // European Languages
                  { value: "fr.hamidullah", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "fr.leclerc", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "de.bubenheim", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "de.khoury", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "es.cortes", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "es.garcia", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "it.piccardo", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "pt.elhayek", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "ru.kuliev", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "ru.osmanov", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "nl.keyzer", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "bs.korkut", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "cs.hrbek", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "no.berg", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "sv.bernstrom", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  { value: "sq.ahmeti", group: currentLang === 'ar' ? "الأوروبية" : "European" },
                  
                  // Middle Eastern & Central Asian
                  { value: "tr.diyanet", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "tr.bulac", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "ur.junagarhi", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "ur.kanzuliman", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "fa.ansarian", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "fa.makarem", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "az.mammadaliyev", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  { value: "ku.asan", group: currentLang === 'ar' ? "الشرق الأوسط وآسيا الوسطى" : "Middle East & Central Asia" },
                  
                  // South & Southeast Asian
                  { value: "id.indonesian", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  { value: "ms.basmeih", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  { value: "bn.bengali", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  { value: "hi.hindi", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  { value: "ta.tamil", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  { value: "th.thai", group: currentLang === 'ar' ? "جنوب وجنوب شرق آسيا" : "South & Southeast Asia" },
                  
                  // East Asian
                  { value: "zh.jian", group: currentLang === 'ar' ? "شرق آسيا" : "East Asia" },
                  { value: "ja.japanese", group: currentLang === 'ar' ? "شرق آسيا" : "East Asia" },
                  { value: "ko.korean", group: currentLang === 'ar' ? "شرق آسيا" : "East Asia" },
                  
                  // African
                  { value: "ha.gumi", group: currentLang === 'ar' ? "الأفريقية" : "African" },
                  { value: "sw.barwani", group: currentLang === 'ar' ? "الأفريقية" : "African" },
                  { value: "so.abduh", group: currentLang === 'ar' ? "الأفريقية" : "African" },
                  { value: "am.sadiq", group: currentLang === 'ar' ? "الأفريقية" : "African" },
                  { value: "yo.mikail", group: currentLang === 'ar' ? "الأفريقية" : "African" }
              ];
              
              // Group translations by region
              const groupedTranslations = {};
              translationOptions.forEach(option => {
                  if (!groupedTranslations[option.group]) {
                      groupedTranslations[option.group] = [];
                  }
                  groupedTranslations[option.group].push(option.value);
              });
              
              // Build the dropdown HTML with optgroups
              let optionsHTML = '';
              Object.keys(groupedTranslations).forEach(groupName => {
                  optionsHTML += `<optgroup label="${groupName}">`;
                  groupedTranslations[groupName].forEach(translationKey => {
                      if (lang.translationNames[translationKey]) {
                          optionsHTML += `<option value="${translationKey}">${lang.translationNames[translationKey]}</option>`;
                      }
                  });
                  optionsHTML += `</optgroup>`;
              });
              
              translationSelect.innerHTML = optionsHTML;

              // Restore the previously selected translation if it exists
              if (currentTranslation) {
                  translationSelect.value = currentTranslation;
              }
          }
      }



      // Add this new function to handle translation changes
      async function handleTranslationChange(selectedTranslation) {
          try {
              const response = await fetch(`https://api.alquran.cloud/v1/quran/${selectedTranslation}`);
              if (!response.ok) throw new Error('Failed to fetch translation');
              const data = await response.json();
              translationData = data.data.surahs;
              
              // Update the display if we're in the Quran tab and have a surah selected
              if (currentSurah !== null) {
                  if (isReadingMode) {
                      loadReadingModeAyahs();
                  } else {
                      displayAyah();
                  }
              }
              
          } catch (error) {
              console.error('Error loading translation:', error);
              showToast(currentLang === 'ar' ? 'حدث خطأ في تحميل الترجمة' : 'Error loading translation', 'error');
          }
      }

      function updateSurahDropdown() {
          // Update surah menu button text
          const selectedSurahText = document.getElementById('selectedSurahText');
          if (selectedSurahText) {
              if (currentSurah !== null && quranData && quranData[currentSurah]) {
                  const surah = quranData[currentSurah];
                  const surahName = currentLang === 'ar' ? surah.name : surahNamesEnglish[currentSurah];
                  selectedSurahText.textContent = `${surah.number}. ${surahName}`;
              } else {
                  selectedSurahText.textContent = languages[currentLang].selectSurah;
              }
          }
          
          // Update surah menu data and repopulate if menu is open
          if (quranData) {
              surahsData = quranData.map((surah, index) => ({
                  index: index,
                  number: surah.number,
                  name: surah.name,
                  englishName: surahNamesEnglish[index] || surah.englishName,
                  revelationType: surah.revelationType,
                  numberOfAyahs: surah.numberOfAyahs
              }));
              
              // If menu is open, repopulate it
              const surahList = document.getElementById('surahList');
              if (surahList && surahList.children.length > 0) {
                  populateSurahList(surahsData);
              }
          }
      }

      function updatePrayerTimesUI() {
          const lang = languages[currentLang];
         
          
          document.getElementById('prayerTitle').innerText = lang.prayerTitle;
          
          // Update prayer names with the working selector
          const fajrNameSpan = document.querySelector('#azan-fajr .font-medium');
          if (fajrNameSpan) {
              fajrNameSpan.innerText = lang.fajr;
          } else {
              console.error("Fajr name span not found!");
          }
          
          const sunriseNameSpan = document.querySelector('#azan-sunrise .font-medium');
          if (sunriseNameSpan) sunriseNameSpan.innerText = lang.sunrise;
          
          const duhaNameSpan = document.querySelector('#azan-duha .font-medium');
          if (duhaNameSpan) duhaNameSpan.innerText = lang.duha;
          
          const dhuhrNameSpan = document.querySelector('#azan-dhuhr .font-medium');
          if (dhuhrNameSpan) dhuhrNameSpan.innerText = lang.dhuhr;
          
          const asrNameSpan = document.querySelector('#azan-asr .font-medium');
          if (asrNameSpan) asrNameSpan.innerText = lang.asr;
          
          const maghribNameSpan = document.querySelector('#azan-maghrib .font-medium');
          if (maghribNameSpan) maghribNameSpan.innerText = lang.maghrib;
          
          const ishaNameSpan = document.querySelector('#azan-isha .font-medium');
          if (ishaNameSpan) ishaNameSpan.innerText = lang.isha;
          

      }

      fetch('adhkar.json')
          .then(res => res.json())
          .then(data => {
              adhkar.push(...data);
              document.getElementById('loadingSpinner').classList.add('hidden');
          })
          .catch(err => console.error("Error loading adhkar.json:", err));

      function loadAdhkar(time) {
          // Filter by time and remove duplicates based on Arabic text
          const timeFiltered = adhkar.filter(d => d.time === time);
          
          // Deduplicate based on Arabic text (keeping the first occurrence)
          const uniqueAdhkar = [];
          const seenArabic = new Set();
          
          for (const dhikr of timeFiltered) {
              // Normalize Arabic text by removing extra whitespace and diacritics for comparison
              const normalizedArabic = dhikr.arabic.replace(/\s+/g, ' ').trim();
              
              if (!seenArabic.has(normalizedArabic)) {
                  seenArabic.add(normalizedArabic);
                  uniqueAdhkar.push(dhikr);
              }
          }
          
          filteredAdhkar = uniqueAdhkar.map(d => ({
              ...d,
              remainingRepeats: d.repeat
          }));

          current = 0;
          
          // Immediate transition without animation delay
          const homeElement = document.getElementById('home');
          const adhkarViewElement = document.getElementById('adhkarView');
          
          homeElement.classList.add('hidden');
          adhkarViewElement.classList.remove('hidden');
          
          // Display dhikr immediately
          displayDhikr();
          
          // Reset Quran content when loading adhkar
          resetQuranContent();
      }

      function displayDhikr() {
          if (!filteredAdhkar.length) return;
          const dhikr = filteredAdhkar[current];

          
          // Update text content
          document.getElementById('adhkarArabicText').innerText = dhikr.arabic;
          document.getElementById('transliterationText').innerText = dhikr.transliteration;
          document.getElementById('translationTextDikr').innerText = dhikr.translation;
          document.getElementById('dhikrCounter').innerText = languages[currentLang].counter(current + 1, filteredAdhkar.length);
          document.getElementById('repeatValue').innerText = dhikr.remainingRepeats;
          
          // Initialize counter display
          const totalRepeats = dhikr.repeat;
          const currentCount = totalRepeats - dhikr.remainingRepeats;
          const progress = (currentCount / totalRepeats) * 100;
          
          // Update counter number
          const counterNumber = document.getElementById('dhikrCountNumber');
          if (counterNumber) {
              counterNumber.textContent = currentCount;
              counterNumber.style.color = ''; // Reset color
          }
          
          // Update progress ring
          const progressRing = document.getElementById('dhikrProgressRing');
          if (progressRing) {
              // Reset ring colors
              progressRing.classList.remove('text-green-500', 'dark:text-green-400', 'text-yellow-500', 'dark:text-yellow-400');
              progressRing.classList.add('text-blue-500', 'dark:text-blue-400');
              
              // Set progress
              const circumference = 2 * Math.PI * 40;
              const offset = circumference - (progress / 100) * circumference;
              progressRing.style.strokeDashoffset = offset;
              
              // Update color based on progress
              if (progress >= 100) {
                  progressRing.classList.remove('text-blue-500', 'dark:text-blue-400');
                  progressRing.classList.add('text-green-500', 'dark:text-green-400');
              } else if (progress >= 75) {
                  progressRing.classList.remove('text-blue-500', 'dark:text-blue-400');
                  progressRing.classList.add('text-yellow-500', 'dark:text-yellow-400');
              }
          }
          
          // Load auto-swipe preference
          loadAutoSwipePreference();
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
          // Immediate transition without animation delay
          const adhkarViewElement = document.getElementById('adhkarView');
          const homeElement = document.getElementById('home');
          
          adhkarViewElement.classList.add('hidden');
          homeElement.classList.remove('hidden');
      }

      // Toggle functions for pronunciation and translation
      function toggleTransliteration() {
          const section = document.getElementById('transliterationSection');
          const btn = document.getElementById('transliterationBtn');
          
          if (section.classList.contains('hidden')) {
              section.classList.remove('hidden');
              btn.classList.add('bg-green-200', 'dark:bg-green-800/60');
              btn.classList.remove('bg-gradient-to-r', 'from-green-100', 'to-emerald-100', 'dark:from-green-900/40', 'dark:to-emerald-900/40');
          } else {
              section.classList.add('hidden');
              btn.classList.remove('bg-green-200', 'dark:bg-green-800/60');
              btn.classList.add('bg-gradient-to-r', 'from-green-100', 'to-emerald-100', 'dark:from-green-900/40', 'dark:to-emerald-900/40');
          }
      }

      function toggleTranslation() {
          const section = document.getElementById('translationSection');
          const btn = document.getElementById('translationBtn');
          
          if (section.classList.contains('hidden')) {
              section.classList.remove('hidden');
              btn.classList.add('bg-blue-200', 'dark:bg-blue-800/60');
              btn.classList.remove('bg-gradient-to-r', 'from-blue-100', 'to-indigo-100', 'dark:from-blue-900/40', 'dark:to-indigo-900/40');
          } else {
              section.classList.add('hidden');
              btn.classList.remove('bg-blue-200', 'dark:bg-blue-800/60');
              btn.classList.add('bg-gradient-to-r', 'from-blue-100', 'to-indigo-100', 'dark:from-blue-900/40', 'dark:to-indigo-900/40');
          }
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

      // Function to calculate Duha prayer time (approximately 20 minutes after sunrise)
      function calculateDuhaTime(sunriseTime) {
          const [hours, minutes] = sunriseTime.split(':').map(Number);
          let duhaMinutes = minutes + 20;
          let duhaHours = hours;
          
          if (duhaMinutes >= 60) {
              duhaHours += Math.floor(duhaMinutes / 60);
              duhaMinutes = duhaMinutes % 60;
          }
          
          if (duhaHours >= 24) {
              duhaHours -= 24;
          }
          
          return `${duhaHours.toString().padStart(2, '0')}:${duhaMinutes.toString().padStart(2, '0')}`;
      }

      // Add these storage helper functions at the top with other variables
      function savePrayerTimes(timings, location, city) {
          // Add Duha prayer time calculation
          if (timings.Sunrise && !timings.Duha) {
              timings.Duha = calculateDuhaTime(timings.Sunrise);
          }
          
          const dataToSave = {
              timings: timings,
              location: location,
              city: city,
              lastUpdated: new Date().toISOString() // Store as ISO string for easier parsing
          };
          try {
              localStorage.setItem('prayerTimes', JSON.stringify(dataToSave));
          } catch (error) {
              // Fallback to sessionStorage for iOS private browsing or if localStorage is full
              try {
                  sessionStorage.setItem('prayerTimes', JSON.stringify(dataToSave));
              } catch (sessionError) {
                  console.error('Error saving prayer times to localStorage and sessionStorage:', error, sessionError);
              }
          }
          // Call highlighting function after saving times
          setupPrayerHighlighting();
      }

      function loadPrayerTimes() {
          let savedData = null;
          // ... (existing code to load from localStorage or sessionStorage)
          try {
              const localStorageData = localStorage.getItem('prayerTimes');
              if (localStorageData) {
                  savedData = JSON.parse(localStorageData);
              }
          } catch (error) {
              console.error('Error reading from localStorage:', error);
          }

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
              if (lastUpdated.toDateString() === now.toDateString()) {
                  prayerNotifications = savedData.timings;
                  currentCity = savedData.city;
                  // ... (existing UI updates for prayer times)
                  document.getElementById("azan-location").innerText = languages[currentLang].locationText(savedData.city, savedData.location);
                  // Use font-bold selectors for cached prayer times with formatting
                  const fajrSpan = document.querySelector("#azan-fajr .font-bold");
                  if (fajrSpan) fajrSpan.innerText = formatTime(savedData.timings.Fajr);
                  
                  const sunriseSpan = document.querySelector("#azan-sunrise .font-bold");
                  if (sunriseSpan) sunriseSpan.innerText = formatTime(savedData.timings.Sunrise);
                  
                  const duhaSpan = document.querySelector("#azan-duha .font-bold");
                  if (duhaSpan && savedData.timings.Duha) {
                      duhaSpan.innerText = formatTime(savedData.timings.Duha);
                  } else if (duhaSpan && savedData.timings.Sunrise) {
                      // Calculate Duha if not stored
                      const duhaTime = calculateDuhaTime(savedData.timings.Sunrise);
                      duhaSpan.innerText = formatTime(duhaTime);
                  }
                  
                  const dhuhrSpan = document.querySelector("#azan-dhuhr .font-bold");
                  if (dhuhrSpan) dhuhrSpan.innerText = formatTime(savedData.timings.Dhuhr);
                  
                  const asrSpan = document.querySelector("#azan-asr .font-bold");
                  if (asrSpan) asrSpan.innerText = formatTime(savedData.timings.Asr);
                  
                  const maghribSpan = document.querySelector("#azan-maghrib .font-bold");
                  if (maghribSpan) maghribSpan.innerText = formatTime(savedData.timings.Maghrib);
                  
                  const ishaSpan = document.querySelector("#azan-isha .font-bold");
                  if (ishaSpan) ishaSpan.innerText = formatTime(savedData.timings.Isha);
                  
                  // Update prayer names after setting times
                  updatePrayerTimesUI();

                  if (notificationEnabled) {
                      setupPrayerNotifications();
                  }
                  // Call highlighting function if times are loaded from storage
                  setupPrayerHighlighting();
                  return true;
              }
          }
          return false;
      }

      // Update the fetchPrayerTimes function
      async function fetchPrayerTimes(city = "Amman") {
          const today = new Date().toISOString().split('T')[0];
          const formattedDate = today.split('-').reverse().join('-');
          const cacheKey = `prayer-${city}-${formattedDate}`;
          
          // Try multiple approaches
          const strategies = [
              // 1. Direct API call
              async () => {
                  const url = `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(city)}`;
                  const response = await fetch(url);
                  if (!response.ok) throw new Error('Direct API failed');
                  return response.json();
              },
              
              // 2. Service Worker cached version
              async () => {
                  const cache = await caches.open('api-cache-v1');
                  const cached = await cache.match(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(city)}`);
                  if (!cached) throw new Error('No cache available');
                  return cached.json();
              },
              
              // 3. localStorage fallback
              async () => {
                  const stored = localStorage.getItem(cacheKey);
                  if (!stored) throw new Error('No localStorage data');
                  return JSON.parse(stored);
              }
          ];

          for (const strategy of strategies) {
              try {
                  const data = await strategy();
                  // Store successful response in localStorage as backup
                  localStorage.setItem(cacheKey, JSON.stringify(data));
                  
                  if (data.code === 200) {
                      const timings = data.data.timings;
                      const location = data.data.meta.timezone;

                      // Store timings for notifications
                      prayerNotifications = timings;
                      
                      // Save to storage
                      savePrayerTimes(timings, location, city);
            

                      document.getElementById("azan-location").innerText = languages[currentLang].locationText(city, location);
                                        // Use font-bold selectors for API prayer times with formatting
                  const fajrEl = document.querySelector("#azan-fajr .font-bold");
                  if (fajrEl) fajrEl.innerText = formatTime(timings.Fajr);
                  
                  const sunriseEl = document.querySelector("#azan-sunrise .font-bold");
                  if (sunriseEl) sunriseEl.innerText = formatTime(timings.Sunrise);
                  
                  const duhaEl = document.querySelector("#azan-duha .font-bold");
                  if (duhaEl) {
                      if (timings.Duha) {
                          duhaEl.innerText = formatTime(timings.Duha);
                      } else {
                          // Calculate Duha if not provided by API
                          const duhaTime = calculateDuhaTime(timings.Sunrise);
                          duhaEl.innerText = formatTime(duhaTime);
                      }
                  }
                  
                  const dhuhrEl = document.querySelector("#azan-dhuhr .font-bold");
                  if (dhuhrEl) dhuhrEl.innerText = formatTime(timings.Dhuhr);
                  
                  const asrEl = document.querySelector("#azan-asr .font-bold");
                  if (asrEl) asrEl.innerText = formatTime(timings.Asr);
                  
                  const maghribEl = document.querySelector("#azan-maghrib .font-bold");
                  if (maghribEl) maghribEl.innerText = formatTime(timings.Maghrib);
                  
                  const ishaEl = document.querySelector("#azan-isha .font-bold");
                  if (ishaEl) ishaEl.innerText = formatTime(timings.Isha);
                      
                      // Update prayer names after setting times
                      updatePrayerTimesUI();

                      // Setup notifications if enabled
                      if (notificationEnabled) {
                
                          setupPrayerNotifications();
                      }
                      // Call highlighting function if times are loaded from storage
                      setupPrayerHighlighting();
                      return;
                  }
              } catch (error) {
                  console.warn(`Strategy failed: ${error.message}`);
                  continue;
              }
          }

          // If all strategies fail, show error message
          document.getElementById("azan-location").innerText = languages[currentLang].arErrorMessage;
          throw new Error('All prayer time fetch strategies failed');
      }

      async function detectCityAndFetchTimes() {
          try {
              // Request user's actual location using device geolocation
              const position = await new Promise((resolve, reject) => {
                  if (!navigator.geolocation) {
                      reject(new Error('Geolocation is not supported by this browser'));
                      return;
                  }
                  
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 300000 // 5 minutes
                  });
              });
              
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              
                             // Try to get city name from coordinates
               const cityName = await getCityNameFromCoordinates(lat, lng);
               currentCity = cityName || "Amman";
               
               // Fetch prayer times using coordinates for maximum accuracy
               await fetchPrayerTimes(currentCity, { lat, lng });
              
              // Update location display
              const locationElement = document.getElementById("azan-location");
              if (locationElement) {
                  locationElement.innerText = languages[currentLang].locationText(currentCity, 'Local Time');
              }
              
          } catch (error) {
              console.error("Could not detect location, falling back to Amman.", error);
              
                             // Show user-friendly message about location access
               const locationElement = document.getElementById("azan-location");
               const requestLocationBtn = document.getElementById("requestLocationBtn");
               
               if (locationElement && requestLocationBtn) {
                   const message = currentLang === 'ar' ? 
                       'موقع افتراضي - عمان' : 
                       'Default location - Amman';
                   locationElement.innerText = message;
                   
                   // Show the location request button
                   requestLocationBtn.classList.remove('hidden');
               }
              
              await fetchPrayerTimes("Amman");
          }
      }
      
      // Helper function to get city name from coordinates
      async function getCityNameFromCoordinates(lat, lng) {
          try {
              // Use a more comprehensive city lookup
              const cityName = getCityName(lat, lng);
              if (cityName) {
                  return cityName;
              }
              
              // Fallback: use reverse geocoding API
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
              const data = await response.json();
              
              return data.city || data.locality || data.principalSubdivision || "Amman";
          } catch (error) {
              console.error("Error getting city name from coordinates:", error);
              return null;
          }
      }

      // Function to navigate to home screen (adhkar tab)
      function goToHomeScreen() {
          // Click the adhkar tab to go to home screen
          const adhkarTab = document.getElementById('adhkarTab');
          if (adhkarTab) {
              adhkarTab.click();
          }
      }

      function setupTabs() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

          const tabs = document.querySelectorAll('.tab');
          tabs.forEach(tab => {
              tab.addEventListener('click', () => {
                  const previousActiveTab = document.querySelector('.tab.active');
                  const previousTabId = previousActiveTab ? previousActiveTab.getAttribute('data-tab') : null;
                  const tabId = tab.getAttribute('data-tab');
                  console.log('Tab clicked:', tabId);
                  
                  // Immediate visual feedback
                  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                  tab.classList.add('active');
                  document.getElementById(`${tabId}Content`).classList.add('active');

                  // Handle tab-specific logic asynchronously to avoid blocking UI
                  setTimeout(() => {
                      // Handle Quran controls visibility
                      const controls = getQuranControls();
                      if (controls) {
                          if (tabId === 'quran') {
                              controls.style.display = 'flex';
                              controls.classList.remove('quran-controls-hidden');
                          } else {
                              controls.style.display = 'none';
                          }
                      }

                  // Reset reading mode when switching away from Quran tab
                  if (previousTabId === 'quran' && tabId !== 'quran' && isReadingMode) {
                      isReadingMode = false;
                      const btnReadingMode = document.getElementById('btnReadingMode');
                      if (btnReadingMode) {
                          btnReadingMode.innerHTML = '<i class="fas fa-book-open w-3 h-3"></i>';
                      }
                      // Remove scroll listener
                      if (window.currentScrollListener) {
                          window.removeEventListener('scroll', window.currentScrollListener);
                          window.currentScrollListener = null;
                      }
                      // Hide page/Juz indicator
                      hidePageJuzIndicator();
                  }
                  
                  // Stop compass when switching away from Qibla tab
                  if (previousTabId === 'qibla' && tabId !== 'qibla') {
                      stopCompass();
                  }

                  if (tabId === 'qibla') {
                     // Qibla tab is now ready - no auto-initialization needed
                     // User will click the start button when ready
                      }
            
            if (tabId === 'prayer') {
                          // Prayer times tab activated
            }

            if (tabId === 'tasbih') {
                          // Tasbih tab activated
            } 

                  if (tabId === 'quran') {
                          // Load Quran data asynchronously without blocking UI
                          (async () => {
                      try {
                          if (!quranData || !translationData) {
                              await loadQuranData();
                          } else {
                              resetQuranContent();
                          }
                          
                          // Initialize Quran search if not already done
                          if (!document.getElementById('quranSearchInput').hasAttribute('data-initialized')) {
                              initializeQuranSearch();
                              document.getElementById('quranSearchInput').setAttribute('data-initialized', 'true');
                          }
                      } catch (error) {
                          const arabicText = document.getElementById('arabicText');
                          if (arabicText) {
                              arabicText.innerHTML = `
                                  <div class="text-red-500 dark:text-red-400 py-8">
                                      <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                                      <p class="text-xl">${currentLang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}</p>
                                      <p class="text-sm mt-4">${error.message}</p>
                                  </div>
                              `;
                          }
                      }
                          })();
                      }

                      if (tabId === 'video') {
                          console.log('setupTabs: Video tab clicked, initializing video generator...');
                          initializeVideoGenerator();
                      }
                  }, 0);
              });
          });
      }

      // Update loadQuranData function to include more detailed logging
      async function loadQuranData() {
          try {
              // Try to get cached data first
              let quranJson = null;
              let translationJson = null;
              
              try {
                  const cachedQuran = localStorage.getItem('quranData');
                  const cachedTranslation = localStorage.getItem('translationData');
                  
                  if (cachedQuran) {
                      quranJson = JSON.parse(cachedQuran);
      
                  }
                  
                  if (cachedTranslation) {
                      translationJson = JSON.parse(cachedTranslation);
  
                  }
              } catch (error) {
                  console.error('Error reading from cache:', error);
              }

              // If no cached data, fetch from API
              if (!quranJson) {
                  const quranResponse = await fetch('https://api.alquran.cloud/v1/quran/quran-simple');
                  if (!quranResponse.ok) {
                      throw new Error(`Failed to load Quran data: ${quranResponse.status}`);
                  }
                  quranJson = await quranResponse.json();
                  
                  // Cache the data asynchronously to avoid blocking
                  setTimeout(() => {
                  try {
                      localStorage.setItem('quranData', JSON.stringify(quranJson));
                  } catch (error) {
                      console.error('Error caching Quran data:', error);
                  }
                  }, 0);
              }

              if (!translationJson) {
                  const translationResponse = await fetch('https://api.alquran.cloud/v1/quran/en.sahih');
                  if (!translationResponse.ok) {
                      throw new Error(`Failed to load translation: ${translationResponse.status}`);
                  }
                  translationJson = await translationResponse.json();
                  
                  // Cache the data asynchronously to avoid blocking
                  setTimeout(() => {
                  try {
                      localStorage.setItem('translationData', JSON.stringify(translationJson));
                  } catch (error) {
                      console.error('Error caching translation data:', error);
                  }
                  }, 0);
              }

              if (!quranJson.data || !quranJson.data.surahs) {
                  throw new Error('Invalid Quran data format');
      }

              quranData = quranJson.data.surahs;

              // Initialize surah menu data asynchronously to avoid blocking
              setTimeout(() => {
                  initializeSurahMenu();
              }, 0);

              if (!translationJson.data || !translationJson.data.surahs) {
                  throw new Error('Invalid translation data format');
              }

              translationData = translationJson.data.surahs;

              currentSurah = null;
              currentAyah = 0;

            //   document.getElementById('btnBookmark').disabled = false;

              let savedBookmark = null;

              try {
                  const localStorageBookmark = localStorage.getItem('quranBookmark');
                  if (localStorageBookmark) {
                      savedBookmark = JSON.parse(localStorageBookmark);
                     
                    
                  }
              } catch (error) {
                  console.error('Error reading from localStorage:', error);
              }

              if (!savedBookmark) {
                  try {
                      const sessionStorageBookmark = sessionStorage.getItem('quranBookmark');
                      if (sessionStorageBookmark) {
                          savedBookmark = JSON.parse(sessionStorageBookmark);
                      }
                  } catch (error) {
                      console.error('Error reading from sessionStorage:', error);
                  }
              }

              if (savedBookmark) {
                  currentBookmark = savedBookmark;
                
              } else {
                 
              }

              resetQuranContent();

              // Set initial tafsir state and icon
              isTafsirVisible = false;
         

          } catch (error) {
              console.error('Error loading Quran data:', error);
              showToast(currentLang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data', 'error');
          }
      }

      function resetQuranContent() {
          currentSurah = null;
          currentAyah = 0;
          
          // Update surah menu button text
          const selectedSurahText = document.getElementById('selectedSurahText');
          if (selectedSurahText) {
              selectedSurahText.textContent = languages[currentLang].selectSurah;
          }
          
          // Show quick surahs section when resetting
          const quickSurahsSection = document.getElementById('quickSurahsSection');
          if (quickSurahsSection) {
              quickSurahsSection.style.display = 'block';
          }
          
          let savedBookmark = null;
          
          try {
              const localStorageBookmark = localStorage.getItem('quranBookmark');
              if (localStorageBookmark) {
                  savedBookmark = JSON.parse(localStorageBookmark);
              }
          } catch (error) {
              console.error('Error reading from localStorage:', error);
          }
          
          if (!savedBookmark) {
              try {
                  const sessionStorageBookmark = sessionStorage.getItem('quranBookmark');
                  if (sessionStorageBookmark) {
                      savedBookmark = JSON.parse(sessionStorageBookmark);
                  }
              } catch (error) {
                  console.error('Error reading from sessionStorage:', error);
              }
          }
          
          if (savedBookmark) {
              try {
                  currentBookmark = savedBookmark;
                  
              } catch (error) {
                  try {
                      localStorage.removeItem('quranBookmark');
                      sessionStorage.removeItem('quranBookmark');
                  } catch (storageError) {
                      console.error('Error removing invalid bookmark:', storageError);
                  }
                  currentBookmark = null;
              }
          }
          
          document.getElementById('arabicText').innerHTML = savedBookmark && quranData ? `
                      <div class="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 max-w-xs mx-auto">
                          <div class="flex items-center gap-3 mb-3">
                              <div class="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <i class="fas fa-bookmark text-blue-500 text-sm"></i>
                              </div>
                              <div class="flex-1 min-w-0">
                                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                          ${currentLang === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}
                                      </h3>
                                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                      ${quranData[savedBookmark.surah].name}
                                      </p>
                                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      ${quranData[savedBookmark.surah].englishName}
                                  </p>
                              </div>
                              <div class="flex-shrink-0 text-right">
                                  <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                          ${currentLang === 'ar' ? 'الآية' : 'Verse'} ${savedBookmark.ayah + 1}
                                      </p>
                                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      ${new Date(savedBookmark.timestamp).toLocaleDateString()}
                                      </p>
                                  </div>
                              </div>
                          <button onclick="goToBookmark()" class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                              <i class="fas fa-play text-sm"></i>
                              <span>${currentLang === 'ar' ? 'متابعة' : 'Continue'}</span>
                              </button>
                      </div>
          ` : '';
          
          document.getElementById('translationText').innerHTML = '';
          
          document.getElementById('btnReadingMode').disabled = true;
      }

      // Add these new functions for notification handling
      async function registerServiceWorker() {
          if ('serviceWorker' in navigator) {
              try {
                  const registration = await navigator.serviceWorker.register('sw.js', {
                      scope: './'
                  });
                  // For iOS, request background fetch permission
                  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                      try {
                          await registration.periodicSync.register('prayer-times', {
                              minInterval: 15 * 60 * 1000 // 15 minutes
                          });
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
              
              // For iOS not in standalone mode, show tutorial but still try to request permission
              if (isIOS && !isInStandaloneMode) {
                  showTutorial();
                  // Continue with permission request anyway
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
                      const toggle = document.getElementById('prayerNotificationToggle');
                      if (toggle) toggle.checked = true;
                
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
                      const toggle = document.getElementById('prayerNotificationToggle');
                      if (toggle) toggle.checked = false;
                      
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
                  const toggle = document.getElementById('prayerNotificationToggle');
                  if (toggle) toggle.checked = false;
                  
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
              const toggle = document.getElementById('prayerNotificationToggle');
              if (toggle) toggle.checked = false;
              const errorMessage = currentLang === 'ar'
                  ? 'حدث خطأ أثناء تفعيل الإشعارات'
                  : 'An error occurred while enabling notifications';
              alert(errorMessage);
              return false;
          }
      }

      function setupBasicNotifications() {
          if (!notificationEnabled) {
              return;
          }

          // Clear any existing timeouts
          clearAllNotificationTimeouts();

          const now = new Date();
          const timings = prayerNotifications;
          
          if (!timings || Object.keys(timings).length === 0) {
              return;
          }

          // Schedule notifications for all remaining prayers today
          const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
          let scheduledCount = 0;

          prayerOrder.forEach(prayer => {
              if (timings[prayer]) {
                  const prayerTime = parseTime(timings[prayer], now);
                  const timeUntilPrayer = prayerTime - now;
                  
                  // Get notification settings from checkboxes
                  const notificationAtTime = localStorage.getItem('notificationAtTime') === 'true';
                  const notification5min = localStorage.getItem('notification5min') === 'true';
                  const notification10min = localStorage.getItem('notification10min') === 'true';
                  const notification15min = localStorage.getItem('notification15min') === 'true';
                  const notification30min = localStorage.getItem('notification30min') === 'true';
                  
                  // Schedule notifications for each selected time
                  const notificationTimes = [];
                  if (notificationAtTime) notificationTimes.push(0);
                  if (notification5min) notificationTimes.push(5);
                  if (notification10min) notificationTimes.push(10);
                  if (notification15min) notificationTimes.push(15);
                  if (notification30min) notificationTimes.push(30);
                  
                  notificationTimes.forEach(minutes => {
                      let notificationTime;
                      if (minutes === 0) {
                          // At prayer time
                          notificationTime = timeUntilPrayer;
                      } else {
                          // Before prayer time
                          const notificationTimeMs = minutes * 60 * 1000;
                          notificationTime = timeUntilPrayer - notificationTimeMs;
                      }
                      
                      // Schedule notification if it's in the future
                      if (notificationTime > 0) {
                      const timeoutId = setTimeout(() => {
                          showBasicNotification(prayer);
                          // Schedule next day's notifications after Isha
                          if (prayer === 'Isha') {
                              setTimeout(() => {
                                  setupBasicNotifications();
                              }, 60000); // Wait 1 minute after Isha, then setup next day
                          }
                          }, notificationTime);
                      
                      notificationTimeouts.push(timeoutId);
                      scheduledCount++;
                  }
                  });
              }
          });
          
          // Save notification state
          saveNotificationState();
          
          // If no prayers left today, schedule for tomorrow
          if (scheduledCount === 0) {
              scheduleNextDayNotifications();
          }
      }

      function parseTime(timeString, baseDate) {
          const [hours, minutes] = timeString.split(':').map(Number);
          const date = new Date(baseDate);
          date.setHours(hours, minutes, 0, 0);
          return date;
      }

      function clearAllNotificationTimeouts() {
          notificationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
          notificationTimeouts = [];
      }

      function scheduleNextDayNotifications() {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(4, 0, 0, 0); // Schedule at 4 AM tomorrow
          
          const timeUntilTomorrow = tomorrow - new Date();
          
          setTimeout(() => {
    
              fetchPrayerTimes(currentCity).then(() => {
                  setupBasicNotifications();
              });
          }, timeUntilTomorrow);
      }

      function saveNotificationState() {
          const state = {
              enabled: notificationEnabled,
              lastSetup: new Date().toISOString(),
              city: currentCity
          };
          localStorage.setItem('notificationState', JSON.stringify(state));
      }

      function loadNotificationState() {
          try {
              const saved = localStorage.getItem('notificationState');
              if (saved) {
                  const state = JSON.parse(saved);
                  const lastSetup = new Date(state.lastSetup);
                  const now = new Date();
                  
                  // Check if it's the same day
                  if (lastSetup.toDateString() === now.toDateString() && state.enabled) {
                      notificationEnabled = true;
                      const toggle = document.getElementById('prayerNotificationToggle');
                      if (toggle) toggle.checked = true;
                      return true;
                  }
              }
          } catch (error) {
              console.error('Error loading notification state:', error);
          }
          return false;
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
    
              fetchPrayerTimes(currentCity);
          }, 60 * 60 * 1000); // Every hour
      }

      // Add these functions to handle the tutorial
      function showTutorial() {
          // Basic iOS detection
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isInStandaloneMode = window.navigator.standalone === true;

          
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
    
      // Add tafsir cache object at the top
      let tafsirCache = {};
      let currentTafsirSource = '2'; // Default tafsir source (Jalalayn ID)

      // Tafsir source mapping - using AlQuran.cloud API for reliable HTTPS support
      const tafsirSources = {
        // Arabic tafsir from AlQuran.cloud API
        '1': { edition: 'ar.muyassar', name: 'التفسير الميسر', language: 'ar', api: 'alquran' },
        '2': { edition: 'ar.jalalayn', name: 'تفسير الجلالين', language: 'ar', api: 'alquran' },
        '3': { edition: 'ar.saddi', name: 'تفسير السعدي', language: 'ar', api: 'alquran' },
        '4': { edition: 'ar.baghawi', name: 'تفسير البغوي', language: 'ar', api: 'alquran' },
        '5': { edition: 'ar.qurtubi', name: 'تفسير القرطبي', language: 'ar', api: 'alquran' },
        '6': { edition: 'ar.kathir', name: 'تفسير ابن كثير', language: 'ar', api: 'alquran' },
        '7': { edition: 'ar.tabari', name: 'تفسير الطبري', language: 'ar', api: 'alquran' },
        
        // English tafsir from spa5k tafsir_api
        'en-jalalayn': { slug: 'en-al-jalalayn', name: 'Tafsir al-Jalalayn (English)', language: 'en', api: 'spa5k' },
        'en-kathir': { slug: 'en-tafisr-ibn-kathir', name: 'Tafsir Ibn Kathir (English)', language: 'en', api: 'spa5k' },
        'en-maarif': { slug: 'en-tafsir-maarif-ul-quran', name: 'Ma\'ariful Quran (English)', language: 'en', api: 'spa5k' },
        'en-tazkirul': { slug: 'en-tazkirul-quran', name: 'Tazkirul Quran (English)', language: 'en', api: 'spa5k' }
      };

             // Update getTafsirForAyah to fetch per-ayah tafsir using multiple APIs
       async function getTafsirForAyah(surah, ayah, tafsirSource = null) {
         const source = tafsirSource || currentTafsirSource;
         const tafsirConfig = tafsirSources[source] || tafsirSources['2']; // Default to Jalalayn
         const cacheKey = `tafsir-${source}-${surah + 1}-${ayah + 1}`;
         
        if (tafsirCache[cacheKey]) {
          return tafsirCache[cacheKey];
        }
         
         try {
           let url, response, data;
           
           if (tafsirConfig.api === 'alquran') {
             // Use AlQuran.cloud API for Arabic tafsir
             url = `https://api.alquran.cloud/v1/ayah/${surah + 1}:${ayah + 1}/${tafsirConfig.edition}`;
             response = await fetch(url);
             if (response.ok) {
               const apiData = await response.json();
               // Transform the response to match our expected format
               if (apiData.data && apiData.data.text) {
                 data = { text: apiData.data.text.replace(/<[^>]*>/g, '') }; // Remove HTML tags
               } else {
                 data = { text: currentLang === 'ar' ? 'لا يوجد تفسير متاح' : 'Tafsir not available' };
               }
          tafsirCache[cacheKey] = data;
          return data;
             } else {
               throw new Error(`HTTP ${response.status}`);
             }
           } else if (tafsirConfig.api === 'spa5k') {
             // Use spa5k tafsir_api for English tafsir with multiple CDN fallbacks
             const cdnUrls = [
               `https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/${tafsirConfig.slug}/${surah + 1}/${ayah + 1}.json`,
               `https://cdn.statically.io/gh/spa5k/tafsir_api/main/tafsir/${tafsirConfig.slug}/${surah + 1}/${ayah + 1}.json`,
               `https://rawcdn.githack.com/spa5k/tafsir_api/main/tafsir/${tafsirConfig.slug}/${surah + 1}/${ayah + 1}.json`
             ];
             
             for (const cdnUrl of cdnUrls) {
               try {
                 response = await fetch(cdnUrl);
                 if (response.ok) {
                   data = await response.json();
                   tafsirCache[cacheKey] = data;
                   return data;
                 }
               } catch (cdnError) {

                 continue;
               }
             }
             throw new Error('All CDN sources failed');
           }
        } catch (error) {

           
           // Fallback to default tafsir if not already using it
           if (source !== '2') {
             return getTafsirForAyah(surah, ayah, '2');
           }
           
          tafsirCache[cacheKey] = { text: currentLang === 'ar' ? 'لا يوجد تفسير متاح' : 'Tafsir not available' };
          return tafsirCache[cacheKey];
        }
      }

      // Store current page/Juz for language switching
      let currentPageNum = null;
      let currentJuzNum = null;

      // Function to update page/Juz indicator in sticky header
      function updatePageJuzIndicator(pageNum, juzNum) {
        const pageJuzIndicator = document.getElementById('pageJuzIndicator');
        const currentPageIndicator = document.getElementById('currentPageIndicator');
        const currentJuzIndicator = document.getElementById('currentJuzIndicator');
        
        if (pageJuzIndicator && currentPageIndicator && currentJuzIndicator) {
          // Store current values
          currentPageNum = pageNum;
          currentJuzNum = juzNum;
          
          // Show the indicator
          pageJuzIndicator.classList.remove('hidden');
          
          // Update page indicator
          currentPageIndicator.textContent = currentLang === 'ar' ? 
            `صفحة ${toArabicNumerals(pageNum)}` : 
            `Page ${pageNum}`;
          
          // Update Juz indicator
          currentJuzIndicator.textContent = currentLang === 'ar' ? 
            `جزء ${toArabicNumerals(juzNum)}` : 
            `Juz ${juzNum}`;
        }
      }

      // Function to hide page/Juz indicator
      function hidePageJuzIndicator() {
        const pageJuzIndicator = document.getElementById('pageJuzIndicator');
        if (pageJuzIndicator) {
          pageJuzIndicator.classList.add('hidden');
        }
      }

      // Function to detect current visible page and update indicator
      function detectCurrentPageAndJuz() {
          if (!isReadingMode || !quranData || currentSurah === null) {
              hidePageJuzIndicator();
              return;
          }

          // Find all page sections currently visible
          const pageSections = document.querySelectorAll('.page-section');
          if (pageSections.length === 0) {
              // Don't hide immediately, might be during a language change - retry once
              setTimeout(() => {
                  const retryPageSections = document.querySelectorAll('.page-section');
                  if (retryPageSections.length === 0 && isReadingMode) {
                      hidePageJuzIndicator();
                  }
              }, 200);
              return;
          }

          let currentPageNum = null;
          let currentJuzNum = null;
          let closestSection = null;
          let closestDistance = Infinity;

          // Get viewport center
          const viewportCenter = window.innerHeight / 2;

          // Find the section closest to viewport center
          pageSections.forEach(section => {
              const rect = section.getBoundingClientRect();
              const sectionCenter = rect.top + (rect.height / 2);
              const distance = Math.abs(sectionCenter - viewportCenter);
              
              // If this section is closer to center or intersects with viewport center
              if (distance < closestDistance || (rect.top <= viewportCenter && rect.bottom >= viewportCenter)) {
                  closestDistance = distance;
                  closestSection = section;
              }
          });

          // Extract page and Juz info from the closest section
          if (closestSection) {
              // Extract page number from the section
              const pageHeader = closestSection.querySelector('.page-header span');
              if (pageHeader) {
                  const pageText = pageHeader.textContent;
                  // Look for both Arabic and English numbers
                  const pageMatch = pageText.match(/\d+/) || pageText.match(/[٠-٩]+/);
                  if (pageMatch) {
                      let pageNumber = pageMatch[0];
                      // Convert Arabic numerals to English if needed
                      if (/[٠-٩]/.test(pageNumber)) {
                          pageNumber = pageNumber.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
                      }
                      currentPageNum = parseInt(pageNumber);
                      
                      // Get Juz from the first ayah in this page section
                      const firstAyah = closestSection.querySelector('.ayah');
                      if (firstAyah) {
                          const surahIndex = parseInt(firstAyah.getAttribute('data-surah'));
                          const ayahIndex = parseInt(firstAyah.getAttribute('data-ayah'));
                          
                          if (quranData[surahIndex] && quranData[surahIndex].ayahs[ayahIndex]) {
                              currentJuzNum = quranData[surahIndex].ayahs[ayahIndex].juz;
                          }
                      }
                  }
              }
          }

          // Update indicator if we found valid page/Juz
          if (currentPageNum && currentJuzNum) {
              updatePageJuzIndicator(currentPageNum, currentJuzNum);
          } else {

          }
      }

      // Update displayAyah to fetch tafsir per ayah
      async function displayAyah() {
          console.log('displayAyah called - currentSurah:', currentSurah, 'currentAyah:', currentAyah);
          const arabicTextElement = document.getElementById('arabicText');
          const translationTextElement = document.getElementById('translationText');
          const surah = quranData && currentSurah !== null ? quranData[currentSurah] : null;
          console.log('Surah found:', surah?.name);
          
          if (surah && surah.ayahs && surah.ayahs[0]) {

          }
          if (currentSurah === null || !quranData || !translationData) {
              console.log('Missing data - currentSurah:', currentSurah, 'quranData:', !!quranData, 'translationData:', !!translationData);
              arabicTextElement.innerHTML = '';
              translationTextElement.innerHTML = '';
              document.getElementById('btnReadingMode').disabled = true;
              return;
          }
          try {
              const translation = translationData[currentSurah];
              if (!surah || !translation) throw new Error('Invalid surah data');
              if (!surah.ayahs || !translation.ayahs) throw new Error('Invalid ayahs data');
              if (
  currentAyah === null ||
  currentAyah === undefined ||
  isNaN(currentAyah) ||
  !surah.ayahs[currentAyah] ||
  !translation.ayahs[currentAyah]
) {
  showToast('Invalid ayah index. Showing the first ayah.', 'error');
  currentAyah = 0;
  // Try again with first ayah
  displayAyah();
  return;
}
              const bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
              const bismillahText2 = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
              let bismillahHtml = '';
              let ayahText = surah.ayahs[currentAyah].text;
              let translationAyah = translation.ayahs[currentAyah];
              let ayahNumber = surah.ayahs[currentAyah].numberInSurah;
              let displayedAyahIndex = currentAyah;
              // For all surahs except At-Tawbah, show Bismillah at the top and remove from ayah text if present
              if (currentAyah === 0 && currentSurah !== 8) {
                  ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
                  ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '');
                  
                  bismillahHtml = `
                    <div class="text-center my-6 text-xl md:text-3xl text-gray-700 dark:text-gray-200 select-none max-w-full md:max-w-2xl mx-auto" dir="rtl" style="letter-spacing: 0.05em; margin-bottom: 2rem;">${bismillahText}</div>
                  `;
                  // If ayahText is empty after removing Bismillah (e.g., Al-Fatiha where first ayah is only Bismillah), 
                  // skip to the actual first content ayah and increment currentAyah accordingly
                  if (!ayahText.trim() && surah.ayahs.length > 1) {
                      currentAyah = 1; // Actually move to the next ayah
                      ayahText = surah.ayahs[1].text;
                      ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
                      ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '');

                      translationAyah = translation.ayahs[1];
                      ayahNumber = surah.ayahs[1].numberInSurah;
                      displayedAyahIndex = 1;
                  }
              } else if (currentAyah === 0 && currentSurah === 8) {
                  // For At-Tawbah first verse, no bismillah
                  bismillahHtml = '';
              }
              // Log the ayah text as it will be displayed (after Bismillah removal)
              if (currentAyah === 0 && currentSurah !== 8) {
              }
              const bookmarkText = languages[currentLang].bookmarkVerse;
              let tafsirHtml = '';
              if (isTafsirVisible) {
                  tafsirHtml = `<div class="text-base text-gray-500 dark:text-gray-400 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" style="font-size: ${1 * currentTextSize}rem;">
                    <div class="font-semibold mb-2">${currentLang === 'ar' ? 'التفسير' : 'Tafsir'}:</div>
                    <span id="tafsir-loading">${currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                  </div>`;
              }
              // Add mobile navigation buttons for all verses
              let mobileNavHtml = `
                  <div class="mobile-nav-buttons">
                    <button onclick="prevAyah()" id="btnPrevAyahMobile" class="mobile-nav-btn" title="Previous - ${languages[currentLang].previousVerse}">
                      <i class="fas fa-chevron-${currentLang === 'ar' ? 'right' : 'left'}"></i> ${languages[currentLang].previousVerse}
                    </button>
                    <button onclick="nextAyah()" id="btnNextAyahMobile" class="mobile-nav-btn" title="Next - ${languages[currentLang].nextVerse}">
                      ${languages[currentLang].nextVerse} <i class="fas fa-chevron-${currentLang === 'ar' ? 'left' : 'right'}"></i>
                    </button>
                  </div>
                `;

              const html = `
                <div class="mb-6">
                  ${bismillahHtml}
                  ${mobileNavHtml}
                  <div class="text-2xl leading-loose mb-2 text-justify md:text-center w-full md:max-w-2xl mx-auto px-4 md:px-8 text-right" dir="rtl" style="font-size: ${1.5 * currentTextSize}rem; line-height: 2.2; word-spacing: 0.1em; letter-spacing: 0.02em;">
                    <span class="ayah" data-surah="${currentSurah}" data-ayah="${displayedAyahIndex}">
                      ${ayahText}
                    </span>
                    <span class="verse-marker" 
                      onclick="bookmarkAyah(${currentSurah}, ${displayedAyahIndex})"
                      title="${bookmarkText}"
                      data-tooltip="${bookmarkText}">
                      <span class="verse-icon"></span><span class="verse-number">${toArabicNumerals(ayahNumber)}</span>
                    </span>
                  </div>
                  ${isTranslationVisible && translationAyah ? `
                    <div class="text-lg text-gray-600 dark:text-gray-400 mb-2 text-left" dir="ltr" style="font-size: ${1.125 * currentTextSize}rem;">
                      ${translationAyah.text}
                    </div>
                  ` : ''}
                  ${isTafsirVisible ? tafsirHtml : ''}
                  
                </div>
              `;
              arabicTextElement.innerHTML = html;
              translationTextElement.innerHTML = '';
              document.getElementById('btnReadingMode').disabled = false;
              
              // Apply saved font preference after content is loaded
              const savedFont = localStorage.getItem('quranFontFamily') || 'font-quran-original';
              changeFontFamily(savedFont);
              
              // Update tooltip for reading mode button when single verse is displayed - only on first visit
              const readingModeBtn = document.getElementById('btnReadingMode');
              if (readingModeBtn && !isReadingMode) {
                  const isFirstVisitCheck = localStorage.getItem('hasVisitedBefore') !== 'true';
                  if (isFirstVisitCheck) {
                      const tooltipText = languages[currentLang].displayFullSurah;
                      readingModeBtn.setAttribute('data-tooltip', tooltipText);
                      readingModeBtn.classList.add('show-tooltip');
                      
                      // Auto-hide tooltip after 4 seconds
                      setTimeout(() => {
                          if (readingModeBtn.classList.contains('show-tooltip')) {
                              readingModeBtn.classList.remove('show-tooltip');
                          }
                      }, 4000);
                  }
              }
              
              // Show verse marker tooltip only on first visit to Quran tab
              setTimeout(() => {
                  const isFirstVisitCheck = localStorage.getItem('hasVisitedBefore') !== 'true';
                  if (isFirstVisitCheck) {
                      const verseMarker = document.querySelector('.verse-marker');
                      if (verseMarker) {
                          // Mark as visited now that we're showing Quran tooltip
                          localStorage.setItem('hasVisitedBefore', 'true');
                          isFirstVisit = false;
                          
                          verseMarker.classList.add('show-tooltip');
                          
                          // Auto-hide tooltip after longer duration on mobile
                          const isMobile = window.innerWidth <= 768;
                          const tooltipDuration = isMobile ? 4000 : 3000;
                          setTimeout(() => {
                              if (verseMarker.classList.contains('show-tooltip')) {
                                  verseMarker.classList.remove('show-tooltip');
                              }
                          }, tooltipDuration);
                      }
                  }
              }, window.innerWidth <= 768 ? 1500 : 1000); // Show after longer delay on mobile
              
              // Update mobile button states
              const prevMobileBtn = document.getElementById('btnPrevAyahMobile');
              const nextMobileBtn = document.getElementById('btnNextAyahMobile');
              if (prevMobileBtn) prevMobileBtn.disabled = currentAyah === 0 && currentSurah === 0;
              if (nextMobileBtn) nextMobileBtn.disabled = currentAyah >= surah.ayahs.length - 1 && currentSurah >= quranData.length - 1;
              
              // Add event listeners for the ayah elements
              
              updateAyahHighlights();
              // Fetch tafsir if needed
              if (isTafsirVisible) {
                  const tafsir = await getTafsirForAyah(currentSurah, displayedAyahIndex);
                  const tafsirElem = document.getElementById('tafsir-loading');
                  if (tafsirElem) tafsirElem.innerText = tafsir.text || (currentLang === 'ar' ? 'لا يوجد تفسير متاح' : 'Tafsir not available');
              }

              // Update page/Juz indicator for single verse mode
              if (surah && surah.ayahs && surah.ayahs[displayedAyahIndex]) {
                  const currentAyahData = surah.ayahs[displayedAyahIndex];
                  if (currentAyahData.page && currentAyahData.juz) {
                      updatePageJuzIndicator(currentAyahData.page, currentAyahData.juz);
                  }
              }
              
              // Update URL with current verse for sharing
              updateVerseURL();
          } catch (error) {
              console.error('Error displaying ayah:', error);
              arabicTextElement.innerHTML = `
                <div class="text-red-500 dark:text-red-400 py-8">
                  <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                  <p class="text-xl">حدث خطأ في عرض الآية</p>
                  <p class="text-lg mt-2">Error displaying verse</p>
                </div>
              `;
              translationTextElement.innerHTML = '';
          }
      }

      function nextAyah() {
          if (currentSurah === null || !quranData) {
              return;
          }

          const surah = quranData[currentSurah];
          


          if (isReadingMode) {
              // In reading mode, move to next surah
              if (currentSurah < quranData.length - 1) {
                  currentSurah++;
                  currentAyah = 0;
                  // Update surah menu button text
                  updateSurahDropdown();
                  loadReadingModeAyahs();
                  // Scroll to the top of the page when moving to a new surah in reading mode
                  setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // Reset progress bar
                      if (isReadingMode) {
                          updateReadingProgress();
                      }
                  }, 100);
              }
          } else {
              // Single verse navigation
              if (currentAyah < surah.ayahs.length - 1) {
                  currentAyah++;

                  displayAyah();
              } else if (currentSurah < quranData.length - 1) {
                  // Move to next surah
                  currentSurah++;
                  currentAyah = 0;
                  // Update surah menu button text
                  updateSurahDropdown();
                
                  displayAyah();
              }
          }
      }

      function prevAyah() {
          if (currentSurah === null || !quranData) {
              return;
          }

          const surah = quranData[currentSurah];
          


          if (isReadingMode) {
              // In reading mode, move to previous surah
              if (currentSurah > 0) {
                  currentSurah--;
                  currentAyah = 0;
                  // Update surah menu button text
                  updateSurahDropdown();
                  loadReadingModeAyahs();
                  // Scroll to the top of the page when moving to a previous surah in reading mode
                  setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // Reset progress bar
                      if (isReadingMode) {
                          updateReadingProgress();
                      }
                  }, 100);
              }
          } else {
              // Single verse navigation
              if (currentAyah > 0) {
                  currentAyah--;

                  displayAyah();
              } else if (currentSurah > 0) {
                  // Move to previous surah
                  currentSurah--;
                  currentAyah = quranData[currentSurah].ayahs.length - 1;
                  // Update surah menu button text
                  updateSurahDropdown();
                
                  displayAyah();
              }
          }
      }

      function loadReadingModeAyahs() {
          if (currentSurah === null || !quranData || !translationData) {
              return;
          }
          
          const surah = quranData[currentSurah];
          const translation = translationData[currentSurah];
          
          
          let ayahText = surah.ayahs[currentAyah].text;
          if (currentAyah === 0 && currentSurah !== 8) {
            ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
            ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '');
          }
          
          // Load all verses in the surah
          readingModeAyahs = [];
          for (let i = 0; i < surah.ayahs.length; i++) {
              if (surah.ayahs[i] && translation.ayahs[i]) {
                  readingModeAyahs.push({
                      arabic: surah.ayahs[i].text,
                      translation: translation.ayahs[i].text,
                      number: i + 1,
                      page: surah.ayahs[i].page, // Include page number from original data
                      juz: surah.ayahs[i].juz // Include Juz number from original data
                  });
              }
          }
          
          // Set currentAyah to 0 since we're showing the whole surah
          currentAyah = 0;
          
          
          
          displayReadingModeAyahs();
      }

      // Update displayReadingModeAyahs to fetch tafsir per ayah and group by pages
      async function displayReadingModeAyahsByPages(shouldScrollToBookmark = false, scrollToVerseId = null, targetVerse = null) {
        const arabicText = document.getElementById('arabicText');
        const translationText = document.getElementById('translationText');
        const bookmarkText = languages[currentLang].bookmarkVerse;
        let html = '';
        
        // Group verses by page number
        const pageGroups = {};
        let startIdx = 0;
        const bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
        
        
        // Group verses by their page numbers
        for (let index = startIdx; index < readingModeAyahs.length; index++) {
          const ayah = readingModeAyahs[index];
          const pageNum = ayah.page || 1; // fallback to page 1 if no page info
          
          if (!pageGroups[pageNum]) {
            pageGroups[pageNum] = [];
          }
          pageGroups[pageNum].push({
            ayah: ayah,
            originalIndex: index,
            ayahIndex: currentAyah + index
          });
        }
        
        // Insert Bismillah at the top for all surahs except At-Tawbah (9)
        let bismillahHtml = '';
        if (currentSurah !== 8) {
                            bismillahHtml = `
                    <div class="text-center my-6 text-xl md:text-3xl text-gray-700 dark:text-gray-200 select-none max-w-full md:max-w-2xl mx-auto" dir="rtl" style="letter-spacing: 0.05em; margin-bottom: 2rem;">${bismillahText}</div>
                  `;
        }
        
        // Add mobile navigation for reading mode
        let mobileNavReadingHtml = `
            <div class="mobile-nav-buttons">
              <button onclick="prevAyah()" id="btnPrevAyahMobileReading" class="mobile-nav-btn" title="Previous Surah - ${languages[currentLang].previousSurah}">
                <i class="fas fa-chevron-${currentLang === 'ar' ? 'right' : 'left'}"></i> ${languages[currentLang].previousSurah}
              </button>
              <button onclick="nextAyah()" id="btnNextAyahMobileReading" class="mobile-nav-btn" title="Next Surah - ${languages[currentLang].nextSurah}">
                ${languages[currentLang].nextSurah} <i class="fas fa-chevron-${currentLang === 'ar' ? 'left' : 'right'}"></i>
              </button>
            </div>
          `;
        
        html += bismillahHtml;
        html += mobileNavReadingHtml;
        
        // Sort pages numerically and render each page group
        const sortedPages = Object.keys(pageGroups).sort((a, b) => parseInt(a) - parseInt(b));
        
        for (let i = 0; i < sortedPages.length; i++) {
          const pageNum = sortedPages[i];
          const pageVersesData = pageGroups[pageNum];
          
          // Page header with number and Juz
          const juzNum = pageVersesData[0].ayah.juz || 1; // Get Juz from first verse of the page
          html += `<div class="page-section mb-8" id="page-${pageNum}">
            <div class="page-header text-center mb-6 pt-4">
              <div class="inline-flex items-center justify-center gap-3">
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400 px-3 py-1 rounded-md bg-gray-50 dark:bg-gray-800/50">${currentLang === 'ar' ? 'صفحة' : 'Page'} ${currentLang === 'ar' ? toArabicNumerals(pageNum) : pageNum}</span>
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400 px-3 py-1 rounded-md bg-gray-50 dark:bg-gray-800/50">${currentLang === 'ar' ? 'جزء' : 'Juz'} ${currentLang === 'ar' ? toArabicNumerals(juzNum) : juzNum}</span>
              </div>
            </div>`;
          
          // Verses for this page
          let pageAyahLine = `<div class="text-2xl leading-loose text-justify md:text-center w-full md:max-w-2xl mx-auto px-4 md:px-8 mb-6 text-right" dir="rtl" style="font-size: ${1.5 * currentTextSize}rem; line-height: 2.2; word-spacing: 0.1em; letter-spacing: 0.02em;">`;
          
          for (let j = 0; j < pageVersesData.length; j++) {
            const verseData = pageVersesData[j];
            let ayahText = verseData.ayah.arabic;
            // Remove Bismillah from first verse if needed
            if (verseData.originalIndex === 0 && currentSurah !== 8) {
              ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
              ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '');

            }
            
            const verseNumber = currentAyah + verseData.originalIndex + 1 - startIdx;
            pageAyahLine += ` <span class="ayah" data-surah="${currentSurah}" data-ayah="${verseData.ayahIndex}">${ayahText}</span> <span class="verse-marker" id="verse-${currentSurah}-${verseData.ayahIndex}" onclick="bookmarkAyah(${currentSurah}, ${verseData.ayahIndex})" title="${bookmarkText}"><span class="verse-icon"></span><span class="verse-number">${toArabicNumerals(verseNumber)}</span></span>`;
        }
          
          pageAyahLine += '</div>';
          html += pageAyahLine;

          // Close page section
          html += '</div>';
          
          // Add separator between pages (except for the last page)
          if (i < sortedPages.length - 1) {
            html += `<div class="page-separator my-8">
              <div class="flex items-center justify-center">
                <div class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-full max-w-md"></div>
                <div class="mx-4">
                  <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
                <div class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-full max-w-md"></div>
              </div>
            </div>`;
          }
        }

        if (isTafsirVisible) {
          html += '<div class="mt-6 space-y-4">';
          for (let index = 0; index < readingModeAyahs.length; index++) {
            html += `<div class="text-base text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" style="font-size: ${1 * currentTextSize}rem;">
              <div class="font-semibold mb-2">${currentLang === 'ar' ? 'التفسير' : 'Tafsir'} - ${languages[currentLang].verse} ${index + 1}</div>
              <span id="tafsir-loading-${index}">${currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>`;
          }
          html += '</div>';
        }
        arabicText.innerHTML = html;
        translationText.innerHTML = '';
        const surah = quranData[currentSurah];
        
        // Apply saved font preference after content is loaded
        const savedFont = localStorage.getItem('quranFontFamily') || 'font-quran-original';
        changeFontFamily(savedFont);

        
        // Update mobile reading mode button states
        const prevMobileReadingBtn = document.getElementById('btnPrevAyahMobileReading');
        const nextMobileReadingBtn = document.getElementById('btnNextAyahMobileReading');
        if (prevMobileReadingBtn) prevMobileReadingBtn.disabled = currentSurah === 0;
        if (nextMobileReadingBtn) nextMobileReadingBtn.disabled = currentSurah >= quranData.length - 1;
        const btn = document.getElementById('btnReadingMode');
        btn.title = `Displaying entire Surah ${surah.name} (${surah.englishName})`;
        // Event listeners for ayah elements are handled by the popover script
        updateAyahHighlights();
        
        // Remove any existing scroll listeners first
        if (window.currentScrollListener) {
          window.removeEventListener('scroll', window.currentScrollListener);
        }
        
        // Add throttled scroll listener for page/Juz detection and progress bar
        let scrollTimeout;
        window.currentScrollListener = () => {
          // Update progress bar immediately for smooth scrolling
          updateReadingProgress();
          
          // Throttle the page/Juz detection
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(detectCurrentPageAndJuz, 50);
        };
        
        window.addEventListener('scroll', window.currentScrollListener, { passive: true });
        
        // Initial detection and progress update
        setTimeout(() => {
            detectCurrentPageAndJuz();
            updateReadingProgress();
        }, 200);
        
        // Fetch tafsir for all ayahs if needed
        if (isTafsirVisible) {
          for (let index = 0; index < readingModeAyahs.length; index++) {
            getTafsirForAyah(currentSurah, currentAyah + index).then(tafsir => {
              const tafsirElem = document.getElementById(`tafsir-loading-${index}`);
              if (tafsirElem) tafsirElem.innerText = tafsir.text || (currentLang === 'ar' ? 'لا يوجد تفسير متاح' : 'Tafsir not available');
            });
          }
        }
        // Scroll logic with improved handling
        setTimeout(() => {
        if (shouldScrollToBookmark && currentBookmark && currentBookmark.surah === currentSurah) {
          const verseElem = document.getElementById(`verse-${currentSurah}-${currentBookmark.ayah}`);
          if (verseElem) {
              const pageSection = verseElem.closest('.page-section');
              if (pageSection) {
                const pageHeader = pageSection.querySelector('.page-header');
                if (pageHeader) {
                  window.scrollTo({
                    top: pageHeader.offsetTop - 60,
                    behavior: 'smooth'
                  });
                }
              }
          }
        } else if (scrollToVerseId) {
          const verseElem = document.getElementById(scrollToVerseId);
          if (verseElem) {
              const pageSection = verseElem.closest('.page-section');
              if (pageSection) {
                const pageHeader = pageSection.querySelector('.page-header');
                if (pageHeader) {
                  window.scrollTo({
                    top: pageHeader.offsetTop - 60,
                    behavior: 'smooth'
                  });
                }
              }
            }
          } else if (targetVerse) {
            // First try to scroll to the specific verse
            const verseElem = document.getElementById(`verse-${targetVerse.surahIndex}-${targetVerse.ayahIndex}`);
            if (verseElem) {
              const pageSection = verseElem.closest('.page-section');
              if (pageSection) {
                const pageHeader = pageSection.querySelector('.page-header');
                if (pageHeader) {
                  window.scrollTo({
                    top: pageHeader.offsetTop - 60,
                    behavior: 'smooth'
                  });
                }
              }
              // Clear the target verse after scrolling
              targetVerseFromSearch = null;
            } else {
              // If verse element not found, try to find and scroll to the page
              const ayah = quranData[targetVerse.surahIndex].ayahs[targetVerse.ayahIndex];
              if (ayah && ayah.page) {
                const pageElem = document.getElementById(`page-${ayah.page}`);
                if (pageElem) {
                  // Add a small delay to ensure the page is rendered
                  const pageHeader = pageElem.querySelector('.page-header');
                  if (pageHeader) {
                    setTimeout(() => {
                      window.scrollTo({
                        top: pageHeader.offsetTop - 60, // Account for sticky header
                        behavior: 'smooth'
                      });
                    }, 100);
                  }
                }
              }
              // Clear the target verse after attempting to scroll
              targetVerseFromSearch = null;
            }
          }
        }, 100);
      }

      // In toggleReadingMode, call displayReadingModeAyahs(true) when entering reading mode, otherwise false
      function toggleReadingMode() {
          const wasReadingMode = isReadingMode;
          isReadingMode = !isReadingMode;
          const btn = document.getElementById('btnReadingMode');
          
          if (isReadingMode) {
              // Update button to show X
              btn.innerHTML = '<i class="fas fa-times"></i>';
              btn.removeAttribute('data-tooltip');
              btn.classList.remove('show-tooltip');
              btn.setAttribute('title', 'Toggle Reading Mode - تبديل وضع القراءة');
              
              // Check if we have a target verse from search
              let targetVerseForScroll = null;
              if (targetVerseFromSearch) {
                  // Set the current position to the target verse
                  currentSurah = targetVerseFromSearch.surahIndex;
                  currentAyah = targetVerseFromSearch.ayahIndex;
                  // Store the target verse for scrolling before clearing it
                  targetVerseForScroll = { ...targetVerseFromSearch };
              }
              
              loadReadingModeAyahs();
              displayReadingModeAyahsByPages(true, null, targetVerseForScroll); // Pass target verse for scrolling
          } else {
              // Clear target verse when exiting reading mode
              targetVerseFromSearch = null;
              btn.innerHTML = '<i class="fas fa-book-open"></i>';
              btn.removeAttribute('title');
              
              // Show auto-appearing tooltip for single verse mode - only on first visit
              const isFirstVisitCheck = localStorage.getItem('hasVisitedBefore') !== 'true';
              if (isFirstVisitCheck) {
                  const tooltipText = languages[currentLang].displayFullSurah;
                  btn.setAttribute('data-tooltip', tooltipText);
                  btn.classList.add('show-tooltip');
                  
                  // Auto-hide tooltip after 4 seconds
                  setTimeout(() => {
                      if (btn.classList.contains('show-tooltip')) {
                          btn.classList.remove('show-tooltip');
                      }
                  }, 4000);
              }
              
              // Remove scroll listener when exiting reading mode
              if (window.currentScrollListener) {
                window.removeEventListener('scroll', window.currentScrollListener);
                window.currentScrollListener = null;
              }
              
              // Hide progress bar when exiting reading mode
              hideProgressBar();
              
              // Only display single ayah if we were previously in reading mode
              if (wasReadingMode) {
              displayAyah();
              }
          }
      }

      function bookmarkAyah(surah, ayah) {
          if ((surah === null || surah === undefined) || !quranData) return;      
          // Convert surah and ayah to numbers to ensure proper comparison
          surah = Number(surah);
          ayah = Number(ayah);
          
          // Ensure ayah is within valid range
          const surahData = quranData[surah];
          if (!surahData || ayah < 0 || ayah >= surahData.ayahs.length) {
              console.error('Invalid ayah number:', ayah);
              return;
          }
          
          const bookmark = {
              surah: surah,
              ayah: ayah,
              timestamp: new Date().toISOString()
          };
          
          // Check if this is the same bookmark as current
          if (currentBookmark && Number(currentBookmark.surah) === surah && Number(currentBookmark.ayah) === ayah) {
              // Remove bookmark
              currentBookmark = null;
              try {
                  localStorage.removeItem('quranBookmark');
                  sessionStorage.removeItem('quranBookmark');
              } catch (error) {
                  console.error('Error removing bookmark:', error);
              }
             
              showToast(currentLang === 'ar' ? 'تم إزالة العلامة المرجعية' : 'Bookmark removed', 'info');
          } else {
              // Set bookmark
              currentBookmark = bookmark;
              try {
                  localStorage.setItem('quranBookmark', JSON.stringify(bookmark));
                  // For iOS, also save to sessionStorage as backup
                  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                      sessionStorage.setItem('quranBookmark', JSON.stringify(bookmark));
                  }
              } catch (error) {
                  console.error('Error saving bookmark:', error);
                  // If localStorage fails, try sessionStorage
                  try {
                      sessionStorage.setItem('quranBookmark', JSON.stringify(bookmark));
                  } catch (sessionError) {
                      console.error('Error saving bookmark to sessionStorage:', sessionError);
                  }
              }
             
              showToast(currentLang === 'ar' ? 'تم إضافة العلامة المرجعية' : 'Bookmark added', 'success');
          }
          
          // Update display
          if (isReadingMode) {
              loadReadingModeAyahs();
              displayReadingModeAyahsByPages(); // Update to use page-based function
          } else {
              displayAyah();
          }
      }

      function toggleBookmark() {
          if (currentSurah === null) return;
          
          bookmarkAyah(currentSurah, currentAyah);
      }

      function goToBookmark() {
          let savedBookmark = null;
          
          // Try localStorage first
          try {
              const localStorageBookmark = localStorage.getItem('quranBookmark');
              if (localStorageBookmark) {
                  savedBookmark = JSON.parse(localStorageBookmark);
              }
          } catch (error) {
              console.error('Error reading from localStorage:', error);
          }
          
          // If no bookmark in localStorage, try sessionStorage
          if (!savedBookmark) {
              try {
                  const sessionStorageBookmark = sessionStorage.getItem('quranBookmark');
                  if (sessionStorageBookmark) {
                      savedBookmark = JSON.parse(sessionStorageBookmark);
                  }
              } catch (error) {
                  console.error('Error reading from sessionStorage:', error);
              }
          }
          
          if (savedBookmark) {
              try {
                  // Store the bookmark position before loading data
                  const bookmarkSurah = savedBookmark.surah;
                  const bookmarkAyah = savedBookmark.ayah;

                  // Set the current surah and ayah
                  currentSurah = bookmarkSurah;
                  currentAyah = bookmarkAyah;
                  
                  // Hide quick surahs section when going to bookmark
                  const quickSurahsSection = document.getElementById('quickSurahsSection');
                  if (quickSurahsSection) {
                      quickSurahsSection.style.display = 'none';
                  }
                  
                  // Update surah menu button text
                  updateSurahDropdown();
                  
                  // Ensure the surah data is loaded
                  if (!quranData || !translationData) {
                      loadQuranData().then(() => {
                          // Restore the bookmark position after data is loaded
                          currentSurah = bookmarkSurah;
                          currentAyah = bookmarkAyah;
                          
                          // After data is loaded, update the display
                          if (isReadingMode) {
                              loadReadingModeAyahs();
                              displayReadingModeAyahsByPages(true); // Scroll to bookmark
                          } else {
                              displayAyah();
                          }
                      });
                  } else {
                      // Data is already loaded, just update the display
                      if (isReadingMode) {
                          loadReadingModeAyahs();
                          displayReadingModeAyahsByPages(true); // Scroll to bookmark
                      } else {
                          displayAyah();
                      }
                  }
              } catch (error) {
                  console.error('Error going to bookmark:', error);
              }
          } else {
              showToast(currentLang === 'ar' ? 'لا توجد علامة مرجعية محفوظة' : 'No bookmark saved', 'info');
          }
      }

      // Reading Progress Bar Functions
      function updateReadingProgress() {
          if (!isReadingMode || currentSurah === null) {
              hideProgressBar();
              return;
          }

          // Get the main content container
          const quranContent = document.getElementById('quranContent');
          if (!quranContent) return;

          // Calculate scroll progress
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          if (scrollHeight <= 0) {
              hideProgressBar();
              return;
          }

          const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
          
          // Update progress bar
          const progressBar = document.getElementById('readingProgressBar');
          
          if (progressBar) {
              progressBar.style.width = progress + '%';
              
              // Show progress bar when scrolling
              showProgressBar();
              
              // Hide progress bar after scrolling stops
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                  hideProgressBar();
              }, 2000);
          }
      }

      function showProgressBar() {
          const progressContainer = document.getElementById('readingProgressContainer');
          
          if (progressContainer) {
              progressContainer.classList.add('visible');
              progressBarVisible = true;
          }
      }

      function hideProgressBar() {
          const progressContainer = document.getElementById('readingProgressContainer');
          
          if (progressContainer) {
              progressContainer.classList.remove('visible');
              progressBarVisible = false;
          }
      }

      function initializeProgressBar() {
          // Remove any existing scroll listeners
          if (window.currentScrollListener) {
              window.removeEventListener('scroll', window.currentScrollListener);
          }
          
          // Create new scroll listener
          window.currentScrollListener = function() {
              updateReadingProgress();
          };
          
          // Add scroll listener
          window.addEventListener('scroll', window.currentScrollListener, { passive: true });
          
          // Initial progress update
          updateReadingProgress();
      }

      async function handleNotificationToggleClick(e) {
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = window.navigator.standalone === true;

        // If turning off notifications
        if (!e.target.checked) {
          notificationEnabled = false;
          saveNotificationState();
          return;
        }

        // For iOS not in standalone mode, show tutorial but continue
        if (isIOS && !isInStandaloneMode) {
          showTutorial();
        }

        // Request notification permission
        try {
          const success = await requestNotificationPermission();
          if (success) {
            notificationEnabled = true;
            saveNotificationState();
            // Setup notifications if prayer times are available
            if (Object.keys(prayerNotifications).length > 0) {
              setupBasicNotifications();
            }
          } else {
            // Permission denied or failed
            e.target.checked = false;
            notificationEnabled = false;
            saveNotificationState();
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          e.target.checked = false;
          notificationEnabled = false;
          saveNotificationState();
        }
      }

        document.addEventListener('DOMContentLoaded', async () => {
    // Initialize preview aspect ratio
    setTimeout(() => {
        const updatePreviewAspectRatio = () => {
            const preview = document.getElementById('videoPreview');
            const orientationSelect = document.getElementById('videoOrientation');
            
            if (preview && orientationSelect) {
                const orientation = orientationSelect.value || 'landscape';
                
                // Remove all aspect ratio classes
                preview.classList.remove('aspect-video', 'aspect-square', 'aspect-[9/16]');
                
                // Add appropriate aspect ratio class based on orientation
                switch (orientation) {
                    case 'portrait':
                        preview.classList.add('aspect-[9/16]'); // 9:16 for portrait
                        break;
                    case 'square':
                        preview.classList.add('aspect-square'); // 1:1 for square
                        break;
                    case 'landscape':
                    default:
                        preview.classList.add('aspect-video'); // 16:9 for landscape
                        break;
                }
            }
        };
        
        // Initialize aspect ratio
        updatePreviewAspectRatio();
        
        // Add event listener for orientation changes
        const orientationSelect = document.getElementById('videoOrientation');
        if (orientationSelect) {
            orientationSelect.addEventListener('change', updatePreviewAspectRatio);
        }
    }, 100);
                   initDarkMode();
          initializeQiblaLocation(); // Immediate initialization
            // Initialize audio context for iOS PWA
            initializeAudioContext();
            // Setup iOS-specific audio session management
            setupIOSAudioSession();
            // Preload audio elements for better performance
            preloadAudioElements();
            // Initialize dynamic sticky positioning
            updateStickyPositioning();
            
            // Add event listeners for responsive sticky positioning
            window.addEventListener('resize', updateStickyPositioning);
            window.addEventListener('orientationchange', () => {
                // Delay to allow orientation change to complete
                setTimeout(updateStickyPositioning, 100);
            });
            
            // Update sticky positioning when DOM changes (for dynamic content)
            const observer = new MutationObserver(() => {
                updateStickyPositioning();
            });
            
            // Observe header and tabs for changes
            const header = document.querySelector('header');
            const tabs = document.querySelector('.flex.justify-center.bg-gradient-to-r');
            if (header) observer.observe(header, { childList: true, subtree: true });
            if (tabs) observer.observe(tabs, { childList: true, subtree: true });
            // Load saved language preference first
            loadLanguagePreference();
            
            // Update main tab language after loading preference
            updateMainTabLanguage();
            
            tafsirLang = currentLang;

            const adhkarView = document.getElementById('adhkarView');
            const adhkarArabicText = document.getElementById('adhkarArabicText');
            if (adhkarView) {
                adhkarView.addEventListener('touchstart', handleTouchStart, false);
                adhkarView.addEventListener('touchend', handleTouchEnd, false);
            }
            if (adhkarArabicText) {
                adhkarArabicText.addEventListener('click', handleDhikrClick);
            }

            setupTabs();
            
            // Initialize daily reminder with today's hadith
            updateDailyReminder();
            
            // Update UI with loaded language
            updateUI();
            
            // Update Hijri date
            updateHijriDate();
            
            // Initialize Tasbih
            loadTasbihState();
            


            // Try to load saved prayer times first
            if (!loadPrayerTimes()) {
                // If no saved times or they're from a different day, fetch new times
                await detectCityAndFetchTimes();
            }

            // Load notification state
            loadNotificationState();

            // Initialize time format toggle
            initializeTimeFormatToggle();

            // Initialize prayer settings
            initializePrayerSettings();

            // Initialize first visit tracking
            initializeFirstVisit();

            // Initialize single verse loop toggle
            initializeSingleVerseLoop();

            // Add location request button handler
            const requestLocationBtn = document.getElementById('requestLocationBtn');
            if (requestLocationBtn) {
                requestLocationBtn.addEventListener('click', async () => {
                    const btn = requestLocationBtn;
                    const btnText = document.getElementById('requestLocationText');
                    
                    // Show loading state
                    btn.disabled = true;
                    const originalText = btnText.textContent;
                    btnText.textContent = currentLang === 'ar' ? 'جاري التحديد...' : 'Detecting...';
                    
                    try {
                        await detectCityAndFetchTimes();
                        // Hide button on success
                        btn.classList.add('hidden');
                    } catch (error) {
                        console.error('Location request failed:', error);
                        // Show error message
                        const locationElement = document.getElementById("azan-location");
                        if (locationElement) {
                            const message = currentLang === 'ar' ? 
                                'فشل في تحديد الموقع - يرجى المحاولة مرة أخرى' : 
                                'Location detection failed - Please try again';
                            locationElement.innerText = message;
                        }
                    } finally {
                        // Reset button state
                        btn.disabled = false;
                        btnText.textContent = originalText;
                    }
                });
            }

            // Add notification toggle handler
            const notificationToggle = document.getElementById('prayerNotificationToggle');
            
          if (notificationToggle) {
          notificationToggle.addEventListener('click', handleNotificationToggleClick);
                
                // Setup notifications if they were previously enabled
                if (notificationEnabled && Object.keys(prayerNotifications).length > 0) {
                    setupBasicNotifications();
                }
                        }


            // Add periodic checks
            setupPeriodicChecks();

            // Load Quran data
            await loadQuranData();
            
            // Initialize URL handling for shareable verse links
            initializeURLHandling();
            
            // Initialize font settings
            initializeFontSettings();
            
            // Update settings language
            updateSettingsLanguage();
            
            // Add translation toggle handler
            
            // Add bookmark toggle handler
            
            // Load saved bookmark
            const savedBookmark = localStorage.getItem('quranBookmark');
            if (savedBookmark) {
                try {
                    currentBookmark = JSON.parse(savedBookmark);
                   
                } catch (error) {
                    console.error('Error loading bookmark:', error);
                    localStorage.removeItem('quranBookmark');
                    currentBookmark = null;
                }
            }

         
            loadTextSizePreference();

            await loadTafsirData();


               // Surah menu button
               document.getElementById('surahMenuBtn').addEventListener('click', openSurahMenu);
            
               // Close menu button
               document.getElementById('closeSurahMenu').addEventListener('click', closeSurahMenu);
               
               // Overlay click to close
               document.getElementById('surahMenuOverlay').addEventListener('click', closeSurahMenu);
               
               // Search functionality
               document.getElementById('surahSearchInput').addEventListener('input', function(e) {
                   searchSurahs(e.target.value);
               });
               
               // Event delegation for surah items (more efficient)
               document.getElementById('surahList').addEventListener('click', function(e) {
                   const surahItem = e.target.closest('.surah-item');
                   if (surahItem && surahItem.dataset.surahIndex) {
                       selectSurah(parseInt(surahItem.dataset.surahIndex));
                   }
               });
               
               // Escape key to close menu
               document.addEventListener('keydown', function(e) {
                   if (e.key === 'Escape') {
                       closeSurahMenu();
                   }
               });
               
               // Initialize Quran search
               initializeQuranSearch();
               
               // Immediate initialization for better performance
                   if (quranData && surahsData.length === 0) {
                       initializeSurahMenu();
                   }

               const menuBtn = document.getElementById('adhkarMenuBtn');
               const modal = document.getElementById('adhkarMenuModal');
               const closeBtn = document.getElementById('closeAdhkarMenu');
               // Open modal
               menuBtn.addEventListener('click', function() {
                 modal.classList.remove('hidden');
               });
               // Close modal by X
               closeBtn.addEventListener('click', function() {
                 modal.classList.add('hidden');
               });
               // Close modal by clicking outside
               modal.addEventListener('click', function(e) {
                 if (e.target === modal) {
                   modal.classList.add('hidden');
                 }
               });

               // Islamic Guides Modal Event Listeners
               const guideDetailModal = document.getElementById('guideDetailModal');
               const closeGuideDetailBtn = document.getElementById('closeGuideDetail');
               
               if (closeGuideDetailBtn) {
                   closeGuideDetailBtn.addEventListener('click', closeGuideDetail);
               }
               
               if (guideDetailModal) {
                   guideDetailModal.addEventListener('click', function(e) {
                       if (e.target === guideDetailModal) {
                           closeGuideDetail();
                       }
                   });
               }
               
               // Close category filter dropdown when clicking outside
               document.addEventListener('click', function(e) {
                   const dropdown = document.getElementById('categoryFilterDropdown');
                   const filterBtn = document.getElementById('categoryFilterBtn');
                   
                   if (dropdown && filterBtn && !dropdown.contains(e.target) && !filterBtn.contains(e.target)) {
                       dropdown.classList.add('hidden');
                   }
               });
                         //nnn
                         var quranHook = document.getElementById('quranHook');
                         if (quranHook) {
                           // Force layout calculation to prevent jump
                           void quranHook.offsetWidth;
                         }

                         updateAzkarTypeLabels();


                   


                         document.getElementById('closeTafsirModal').onclick = closeTafsirModal;
  document.getElementById('tafsirModal').onclick = function(e) {
    if (e.target === this) closeTafsirModal();
  };

  document.getElementById('closeTranslationModal').onclick = closeTranslationModal;
  document.getElementById('translationModal').onclick = function(e) {
    if (e.target === this) closeTranslationModal();
  };





    tafsirModalObserver();
    translationModalObserver();

    initVoiceSearch();
  
    // Update voice search language when app language changes
    const originalSwitchLanguage = window.switchLanguage;
    window.switchLanguage = function() {
      originalSwitchLanguage();
      if (recognition) {
        recognition.lang = currentLang === 'ar';
      }
    };
    
        });



 function translationModalObserver() {
    const translationModal = document.getElementById('translationModal');
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const translationSelect = document.getElementById('translationSelect');
          if (translationModal.style.display === 'flex' && translationSelect) {
            translationSelect.value = currentTranslationKey;
            // Remove existing listeners to avoid duplicates
            translationSelect.onchange = function() {
              currentTranslationKey = this.value;
              // Reload translation data and content in modal
              handleTranslationChange(this.value).then(() => {
                document.getElementById('translationModalContent').textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
                loadTranslationContent();
              });
            };
          }
        }
      });
    });
    observer.observe(translationModal, { attributes: true });
}
        function tafsirModalObserver() {
            const tafsirModal = document.getElementById('tafsirModal');
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                  const tafsirSelect = document.getElementById('tafsirSelect');
                  if (tafsirModal.style.display === 'flex' && tafsirSelect) {
                    tafsirSelect.value = currentTafsirSource;
                    // Remove existing listeners to avoid duplicates
                    tafsirSelect.onchange = function() {
                      currentTafsirSource = this.value;
                      // Reload tafsir content in modal
                      document.getElementById('tafsirModalContent').textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
                      loadTafsirContent();
                    };
                  }
                }
              });
            });
            observer.observe(tafsirModal, { attributes: true });
        }

        // Add this function to show toast notifications
        function showToast(message, type = 'info') {
            // Remove any existing toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }

            // Create new toast
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            // Set icon based on type
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
            
            toast.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(toast);
            
            // Show toast immediately
            toast.classList.add('show');
            
            // Hide and remove toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 150);
            }, 3000);
        }

        // iOS-specific detection and handling
        function isIOSStandalone() {
            return window.navigator.standalone === true;
        }

        function isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent);
        }

        function showIOSInstallPrompt() {
            if (isIOS() && !isIOSStandalone()) {
                const modal = document.getElementById('iosInstallModal') || createIOSInstallModal();
                // Force a reflow to ensure the modal is visible
                modal.offsetHeight;
                modal.style.display = 'flex';
                modal.classList.remove('hidden');
                
                // Immediate opacity change
                    modal.style.opacity = '1';
            }
        }

        function createIOSInstallModal() {
            const modal = document.createElement('div');
            modal.id = 'iosInstallModal';
            modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            modal.innerHTML = `
    <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-[90%] max-w-lg relative shadow-2xl border border-white/20 dark:border-gray-700/50">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <i class="fas fa-home text-2xl text-white"></i>
                </div>
                    <h3 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${languages[currentLang].tutorialTitle}</h3>
                </div>
                <ol class="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300 text-left">
                    <li>${languages[currentLang].tutorialIOS.steps[0]}</li>
                    <li>${languages[currentLang].tutorialIOS.steps[1]}</li>
                    <li>${languages[currentLang].tutorialIOS.steps[2]}</li>
                </ol>
                <div class="mt-8 flex justify-center">
                    <button onclick="closeIOSInstallModal()" 
                            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                        ${languages[currentLang].gotIt}
                    </button>
                </div>
            </div>
        `;
            document.body.appendChild(modal);
            return modal;
        }

        function closeIOSInstallModal() {
            const modal = document.getElementById('iosInstallModal');
            if (modal) {
                modal.style.opacity = '0';
                    modal.style.display = 'none';
                    modal.classList.add('hidden');
            }
        }

        // Add these variables at the top with other variables
        let currentTextSize = 1; // Base size multiplier
        const TEXT_SIZE_STEP = 0.2; // Size change step
        const MIN_TEXT_SIZE = 0.8; // Minimum size multiplier
        const MAX_TEXT_SIZE = 2.0; // Maximum size multiplier

        // Add these functions for text size control
        function increaseTextSize() {
            if (currentTextSize < MAX_TEXT_SIZE) {
                currentTextSize += TEXT_SIZE_STEP;
                updateTextSize();
                saveTextSizePreference();
                updateFontSizeDisplay();
                updateSliderValue();
                // Refresh current display
                if (currentSurah !== null) {
                    if (isReadingMode) {
                        displayReadingModeAyahs();
                    } else {
                        displayAyah();
                    }
                }
            }
        }

        function decreaseTextSize() {
            if (currentTextSize > MIN_TEXT_SIZE) {
                currentTextSize -= TEXT_SIZE_STEP;
                updateTextSize();
                saveTextSizePreference();
                updateFontSizeDisplay();
                updateSliderValue();
                // Refresh current display
                if (currentSurah !== null) {
                    if (isReadingMode) {
                        displayReadingModeAyahs();
                    } else {
                        displayAyah();
                    }
                }
            }
        }

        function updateSliderValue() {
            const slider = document.getElementById('fontSizeSlider');
            if (slider) {
                slider.value = currentTextSize;
            }
        }

        function resetTextSize() {
            currentTextSize = 1;
            updateTextSize();
            saveTextSizePreference();
            updateFontSizeDisplay();
            updateSliderValue();
            // Refresh current display
            if (currentSurah !== null) {
                if (isReadingMode) {
                    displayReadingModeAyahs();
                } else {
                    displayAyah();
                }
            }
        }

        // Quran Settings Menu Functions
        function toggleQuranSettings() {
            const menu = document.getElementById('quranSettingsMenu');
            const isHidden = menu.classList.contains('hidden');
            
            if (isHidden) {
                // Show menu
                menu.classList.remove('hidden');
                setTimeout(() => {
                    menu.classList.remove('translate-x-full');
                }, 10);
                
                // Add overlay
                const overlay = document.createElement('div');
                overlay.className = 'settings-overlay';
                overlay.onclick = toggleQuranSettings;
                document.body.appendChild(overlay);
                
                // Update displays
                updateFontSizeDisplay();
                updateFontSizeSlider();
                updateSettingsLanguage();
            } else {
                // Hide menu
                menu.classList.add('translate-x-full');
                    menu.classList.add('hidden');
                
                // Remove overlay
                const overlay = document.querySelector('.settings-overlay');
                if (overlay) overlay.remove();
            }
        }

        function updateFontSizeDisplay() {
            const display = document.getElementById('currentFontSize');
            if (display) {
                display.textContent = (1.5 * currentTextSize).toFixed(1) + 'rem';
            }
        }

        function updateFontSizeSlider() {
            const slider = document.getElementById('fontSizeSlider');
            if (slider) {
                slider.value = currentTextSize;
                slider.oninput = function() {
                    currentTextSize = parseFloat(this.value);
                    updateTextSize();
                    updateFontSizeDisplay();
                    saveTextSizePreference();
                    // Refresh current display
                    if (currentSurah !== null) {
                        if (isReadingMode) {
                            displayReadingModeAyahs();
                        } else {
                            displayAyah();
                        }
                    }
                };
            }
        }

        function changeFontFamily(fontClass) {
            const arabicText = document.getElementById('arabicText');
            if (arabicText) {
                // Remove all font classes
                arabicText.classList.remove('font-quran-original', 'font-utman-taha', 'font-al-mushaf', 'font-system-arabic');
                // Add selected font class
                arabicText.classList.add(fontClass);
                
                // Apply font to all Arabic text elements within the arabicText container
                const allArabicElements = arabicText.querySelectorAll('div, span, .ayah');
                allArabicElements.forEach(element => {
                    element.classList.remove('font-quran-original', 'font-utman-taha', 'font-al-mushaf', 'font-system-arabic');
                    element.classList.add(fontClass);
                });
                
                // Save preference
                localStorage.setItem('quranFontFamily', fontClass);
            }
        }

        // Initialize font family radio buttons
        function initializeFontSettings() {
            const fontRadios = document.querySelectorAll('input[name="fontFamily"]');
            const savedFont = localStorage.getItem('quranFontFamily') || 'font-quran-original';
            
            fontRadios.forEach(radio => {
                let expectedValue;
                switch(savedFont) {
                    case 'font-utman-taha':
                        expectedValue = 'utman-taha';
                        break;
                    case 'font-al-mushaf':
                        expectedValue = 'al-mushaf';
                        break;
                    case 'font-system-arabic':
                        expectedValue = 'system-arabic';
                        break;
                    default:
                        expectedValue = 'quran-font';
                }
                
                if (radio.value === expectedValue) {
                    radio.checked = true;
                }
                
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        let fontClass;
                        switch(this.value) {
                            case 'quran-font':
                                fontClass = 'font-quran-original';
                                break;
                            case 'utman-taha':
                                fontClass = 'font-utman-taha';
                                break;
                            case 'al-mushaf':
                                fontClass = 'font-al-mushaf';
                                break;
                            case 'system-arabic':
                                fontClass = 'font-system-arabic';
                                break;
                            default:
                                fontClass = 'font-quran-original';
                        }
                        changeFontFamily(fontClass);
                    }
                });
            });
            
            // Apply saved font
            changeFontFamily(savedFont);
            
            // Initialize other settings
            initializeAudioSettings();
        }



        // Audio Settings Functions
        let currentReciter = 'ar.alafasy';
        let currentPlaybackSpeed = 1;
        let isContinuousPlayEnabled = false;


        function initializeAudioSettings() {
            // Initialize reciter
            const savedReciter = localStorage.getItem('quranReciter') || 'ar.alafasy';
            currentReciter = savedReciter;
            const reciterSelect = document.getElementById('reciterSelect');
            if (reciterSelect) {
                reciterSelect.value = savedReciter;
                reciterSelect.addEventListener('change', function() {
                    currentReciter = this.value;
                    localStorage.setItem('quranReciter', this.value);
                    
                    // Show feedback about reciter change
                    const reciterNames = {
                        'ar.alafasy': currentLang === 'ar' ? 'مشاري العفاسي' : 'Mishary Al-Afasy',
                        'ar.husary': currentLang === 'ar' ? 'محمود خليل الحصري' : 'Mahmoud Khalil Al-Husary',
                        'ar.minshawi': currentLang === 'ar' ? 'محمد صديق المنشاوي' : 'Mohamed Siddiq Al-Minshawi',
                        'ar.sudais': currentLang === 'ar' ? 'عبد الرحمن السديس' : 'Abdul Rahman As-Sudais',
                        'ar.shuraim': currentLang === 'ar' ? 'سعود الشريم' : 'Saud Ash-Shuraim'
                    };
                    
                    const message = currentLang === 'ar' ? 
                        `تم اختيار القارئ: ${reciterNames[this.value]}` : 
                        `Reciter selected: ${reciterNames[this.value]}`;
                    
                    showToast(message, 'success');
                });
            }

            // Initialize playback speed
            const savedSpeed = localStorage.getItem('quranPlaybackSpeed') || '1';
            currentPlaybackSpeed = parseFloat(savedSpeed);
            const speedSelect = document.getElementById('playbackSpeedSelect');
            if (speedSelect) {
                speedSelect.value = savedSpeed;
                speedSelect.addEventListener('change', function() {
                    currentPlaybackSpeed = parseFloat(this.value);
                    localStorage.setItem('quranPlaybackSpeed', this.value);
                    
                    // Show feedback about speed change
                    const message = currentLang === 'ar' ? 
                        `تم تغيير سرعة التشغيل إلى: ${this.value}x` : 
                        `Playback speed changed to: ${this.value}x`;
                    
                    showToast(message, 'success');
                });
            }

            // Initialize continuous play toggle
            const savedContinuousPlay = localStorage.getItem('quranContinuousPlay') === 'true';
            isContinuousPlayEnabled = savedContinuousPlay;
            const continuousToggle = document.getElementById('continuousPlayToggle');
            if (continuousToggle) {
                continuousToggle.checked = savedContinuousPlay;
                continuousToggle.addEventListener('change', function() {
                    isContinuousPlayEnabled = this.checked;
                    localStorage.setItem('quranContinuousPlay', this.checked);
                    
                    // Show feedback about setting change
                    const message = currentLang === 'ar' ? 
                        (this.checked ? 'تم تفعيل التشغيل المستمر' : 'تم إلغاء التشغيل المستمر') : 
                        (this.checked ? 'Continuous play enabled' : 'Continuous play disabled');
                    
                    showToast(message, 'success');
                });
            }


        }

        // Update settings menu language
        function updateSettingsLanguage() {
            const settingsTexts = {
                ar: {
                    title: 'إعدادات القرآن',
                    fontSizeTitle: 'حجم الخط',
                    currentSizeLabel: 'حجم الخط الحالي',
                    resetSizeText: 'إعادة تعيين الحجم',
                    fontFamilyTitle: 'نوع الخط',
                    font1Name: 'خط القرآن الأصلي',
                    font2Name: 'خط عثمان طه',
                    font3Name: 'خط القلم',
                    font4Name: 'خط النظام العربي',
                    font4Desc: 'Arial, Tahoma',
                                  audioTitle: 'إعدادات الصوت',
              reciterLabel: 'القارئ',
              playbackSpeedLabel: 'سرعة التشغيل',
              continuousPlayLabel: 'تشغيل مستمر حتى نهاية السورة',
              continuousPlayDesc: 'عند التشغيل، يستمر حتى آخر آية في السورة',
              singleVerseLoopLabel: 'تكرار الآية الواحدة للحفظ',
              singleVerseLoopDesc: 'يكرر الآية الحالية باستمرار لمساعدة الحفظ',

                    speed1: 'بطيء (0.5x)',
                    speed2: 'أبطأ (0.75x)',
                    speed3: 'عادي (1x)',
                    speed4: 'أسرع (1.25x)',
                    speed5: 'سريع (1.5x)',
                    settingsBtn: 'إعدادات القرآن',
                    decreaseBtn: 'تصغير الخط',
                    increaseBtn: 'تكبير الخط'
                },
                en: {
                    title: 'Quran Settings',
                    fontSizeTitle: 'Font Size',
                    currentSizeLabel: 'Current Font Size',
                    resetSizeText: 'Reset Size',
                    fontFamilyTitle: 'Font Family',
                    font1Name: 'Original Quran Font',
                    font2Name: 'Utman Taha Font',
                    font3Name: 'Al Mushaf Font',
                    font4Name: 'System Arabic Font',
                    font4Desc: 'Arial, Tahoma',
                                  audioTitle: 'Audio Settings',
              reciterLabel: 'Reciter',
              playbackSpeedLabel: 'Playback Speed',
              continuousPlayLabel: 'Continuous Play Until End of Surah',
              continuousPlayDesc: 'When playing, continues until the last verse of the surah',
              singleVerseLoopLabel: 'Single Verse Loop for Memorization',
              singleVerseLoopDesc: 'Repeats current verse continuously to aid memorization',

                    speed1: 'Slow (0.5x)',
                    speed2: 'Slower (0.75x)',
                    speed3: 'Normal (1x)',
                    speed4: 'Faster (1.25x)',
                    speed5: 'Fast (1.5x)',
                    settingsBtn: 'Quran Settings',
                    decreaseBtn: 'Decrease Font Size',
                    increaseBtn: 'Increase Font Size'
                }
            };

            const texts = settingsTexts[currentLang] || settingsTexts.ar;

            // Update all text elements
            const elements = [
                { id: 'settingsTitle', text: texts.title },
                { id: 'fontSizeTitle', text: texts.fontSizeTitle },
                { id: 'currentSizeLabel', text: texts.currentSizeLabel },
                { id: 'resetSizeText', text: texts.resetSizeText },
                { id: 'fontFamilyTitle', text: texts.fontFamilyTitle },
                { id: 'font1Name', text: texts.font1Name },
                { id: 'font2Name', text: texts.font2Name },
                { id: 'font3Name', text: texts.font3Name },
                { id: 'font4Name', text: texts.font4Name },
                { id: 'font4Desc', text: texts.font4Desc },
                            { id: 'audioTitle', text: texts.audioTitle },
            { id: 'reciterLabel', text: texts.reciterLabel },
            { id: 'playbackSpeedLabel', text: texts.playbackSpeedLabel },
            { id: 'continuousPlayLabel', text: texts.continuousPlayLabel },
            { id: 'continuousPlayDesc', text: texts.continuousPlayDesc },
            { id: 'singleVerseLoopLabel', text: texts.singleVerseLoopLabel },
            { id: 'singleVerseLoopDesc', text: texts.singleVerseLoopDesc },

                { id: 'speed1', text: texts.speed1 },
                { id: 'speed2', text: texts.speed2 },
                { id: 'speed3', text: texts.speed3 },
                { id: 'speed4', text: texts.speed4 },
                { id: 'speed5', text: texts.speed5 }
            ];

            elements.forEach(({ id, text }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = text;
                }
            });

            // Update button titles
            const settingsBtn = document.getElementById('settingsBtn');
            const decreaseBtn = document.getElementById('decreaseBtn');
            const increaseBtn = document.getElementById('increaseBtn');

            if (settingsBtn) settingsBtn.title = texts.settingsBtn;
            if (decreaseBtn) decreaseBtn.title = texts.decreaseBtn;
            if (increaseBtn) increaseBtn.title = texts.increaseBtn;
            
            // Update single verse loop labels
            updateSingleVerseLoopLabels();
        }

        // Function to update reciter dropdown options based on current language
        function updateReciterOptions() {
            const reciterSelect = document.getElementById('reciterSelect');
            if (!reciterSelect) return;

            // Store the current selection
            const currentSelection = reciterSelect.value;
            
            // Reciter names for both languages
            const reciterOptions = {
                'ar.alafasy': {
                    ar: 'مشاري العفاسي',
                    en: 'Mishary Al-Afasy'
                },
                'ar.husary': {
                    ar: 'محمود خليل الحصري',
                    en: 'Mahmoud Khalil Al-Husary'
                },
                'ar.minshawi': {
                    ar: 'محمد صديق المنشاوي',
                    en: 'Mohamed Siddiq Al-Minshawi'
                },
                'ar.sudais': {
                    ar: 'عبد الرحمن السديس',
                    en: 'Abdul Rahman As-Sudais'
                },
                'ar.shuraim': {
                    ar: 'سعود الشريم',
                    en: 'Saud Ash-Shuraim'
                }
            };

            // Clear current options
            reciterSelect.innerHTML = '';

            // Add options with appropriate language
            Object.keys(reciterOptions).forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = reciterOptions[value][currentLang];
                reciterSelect.appendChild(option);
            });

            // Restore the previous selection
            if (currentSelection) {
                reciterSelect.value = currentSelection;
            }
        }

        function updateTextSize() {
            const arabicText = document.getElementById('arabicText');
            const translationText = document.getElementById('translationText');
            
            if (arabicText) {
                arabicText.style.fontSize = `${1.5 * currentTextSize}rem`; // Base size is 1.5rem
            }
            if (translationText) {
                translationText.style.fontSize = `${1.125 * currentTextSize}rem`; // Base size is 1.125rem
            }
        }

        function saveTextSizePreference() {
            try {
                localStorage.setItem('quranTextSize', currentTextSize.toString());
            } catch (error) {
                console.error('Error saving text size preference:', error);
            }
        }

        function loadTextSizePreference() {
            try {
                const savedSize = localStorage.getItem('quranTextSize');
                if (savedSize) {
                    currentTextSize = parseFloat(savedSize);
                    updateTextSize();
                }
            } catch (error) {
                console.error('Error loading text size preference:', error);
            }
        }


        // Add this function to load Tafsir data
        async function loadTafsirData() {
            try {
                // Initialize tafsirData as an object to store surah data
                tafsirData = {};
            } catch (error) {
                console.error('Error initializing Tafsir data:', error);
                showToast(currentLang === 'ar' ? 'حدث خطأ في تحميل التفسير' : 'Error loading Tafsir', 'error');
            }
        }

        // Add toggle Tafsir function
        function toggleTafsir() {
            isTafsirVisible = !isTafsirVisible;
            
            if (isTafsirVisible) {
                if (currentSurah !== null) {
                    loadTafsirForSurah(currentSurah + 1).then(() => {
                        // Preserve scroll position in reading mode
                        if (isReadingMode) {
                            const centeredId = getCenteredVerseId();
                            displayReadingModeAyahs(false, centeredId);
                        } else {
                            displayAyah();
                        }
                    });
                }
            } else {
                toggleBtn.innerHTML = '<i class="fas fa-book"></i>';
                // Preserve scroll position in reading mode
                if (isReadingMode) {
                    const centeredId = getCenteredVerseId();
                    displayReadingModeAyahs(false, centeredId);
                } else {
                    displayAyah();
                }
            }
        }


        // Add a function to load Tafsir for a specific surah
        async function loadTafsirForSurah(surahNumber) {
            try {
                const langCode = tafsirLang === 'ar' ? 'ar-tafsir-muyassar' : 'en-al-jalalayn';
                const response = await fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${langCode}/${surahNumber}.json`);
                if (!response.ok) throw new Error('Failed to fetch Tafsir data');
                const data = await response.json();
                tafsirData[surahNumber - 1] = data; // Store with 0-based index
              
            } catch (error) {
                console.error('Error loading Tafsir data:', error);
                showToast(currentLang === 'ar' ? 'حدث خطأ في تحميل التفسير' : 'Error loading Tafsir', 'error');
            }
        }

        // Surah Side Menu Functionality
        let surahsData = []; // Store surah data for search
        
        // Minimal surah names for immediate display (most commonly accessed)
        const quickSurahList = [
            {index: 0, number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', revelationType: 'Meccan', numberOfAyahs: 7},
            {index: 1, number: 2, name: 'البقرة', englishName: 'Al-Baqarah', revelationType: 'Medinan', numberOfAyahs: 286},
            {index: 17, number: 18, name: 'الكهف', englishName: 'Al-Kahf', revelationType: 'Meccan', numberOfAyahs: 110},
            {index: 35, number: 36, name: 'يس', englishName: 'Ya-Sin', revelationType: 'Meccan', numberOfAyahs: 83},
            {index: 54, number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', revelationType: 'Medinan', numberOfAyahs: 78},
            {index: 66, number: 67, name: 'الملك', englishName: 'Al-Mulk', revelationType: 'Meccan', numberOfAyahs: 30},
            {index: 109, number: 110, name: 'النصر', englishName: 'An-Nasr', revelationType: 'Medinan', numberOfAyahs: 3},
            {index: 111, number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', revelationType: 'Meccan', numberOfAyahs: 4},
            {index: 112, number: 113, name: 'الفلق', englishName: 'Al-Falaq', revelationType: 'Meccan', numberOfAyahs: 5},
            {index: 113, number: 114, name: 'الناس', englishName: 'An-Nas', revelationType: 'Meccan', numberOfAyahs: 6}
        ];
        
        function initializeSurahMenu() {
            if (!quranData) return;
            
            surahsData = quranData.map((surah, index) => ({
                index: index,
                number: surah.number,
                name: surah.name,
                englishName: surah.englishName,
                revelationType: surah.revelationType,
                numberOfAyahs: surah.numberOfAyahs
            }));
            
            // Check if there's an active search and re-run it with full data
            const searchInput = document.getElementById('surahSearchInput');
            if (searchInput && searchInput.value.trim()) {
                searchSurahs(searchInput.value);
            } else {
                populateSurahList(surahsData);
            }
        }
        
        // Cache DOM elements for better performance
        let surahListCache = null;
        
        function populateSurahList(surahs) {
            const surahList = document.getElementById('surahList');
            
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            
            // Clear existing content
            surahList.innerHTML = '';
            
            // Batch DOM operations
            surahs.forEach(surah => {
                const surahItem = document.createElement('div');
                surahItem.className = 'surah-item p-4 bg-gradient-to-r from-white/70 to-gray-50/70 dark:from-gray-700/70 dark:to-gray-800/70 backdrop-blur-sm rounded-xl hover:from-white/90 hover:to-gray-50/90 dark:hover:from-gray-600/80 dark:hover:to-gray-700/80 cursor-pointer transition-all duration-300 border border-white/30 dark:border-gray-600/50 shadow-md hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5';
                
                // Use template literals more efficiently
                const number = currentLang === 'ar' ? toArabicNumerals(surah.number) : surah.number;
                const englishName = surah.englishName || surahNamesEnglish[surah.index] || `Surah ${surah.number}`;
                const primaryName = currentLang === 'ar' ? surah.name : englishName;
                const secondaryName = currentLang === 'ar' ? englishName : surah.name;
                // Debug: Check what properties are available
 
                
                // Try multiple ways to get the verse count
                let numberOfAyahs = 0;
                if (surah.numberOfAyahs) {
                    numberOfAyahs = surah.numberOfAyahs;
                } else if (surah.ayahs && Array.isArray(surah.ayahs)) {
                    numberOfAyahs = surah.ayahs.length;
                } else if (surah.verses) {
                    numberOfAyahs = surah.verses;
                } else {
                    // Fallback: Use the known verse counts for each surah
                    const surahVerseCounts = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
                    numberOfAyahs = surahVerseCounts[surah.number - 1] || 0;
                }
                
                const ayahCount = currentLang === 'ar' ? toArabicNumerals(numberOfAyahs) : numberOfAyahs;
                const ayahText = currentLang === 'ar' ? 'آية' : 'verses';
                const revelationType = currentLang === 'ar' ? (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية') : surah.revelationType;
                
                // Color scheme - all sky blue for consistent appearance
                const colorSchemes = [
                    'from-sky-400 to-sky-600',
                    'from-sky-400 to-sky-600', 
                    'from-sky-400 to-sky-600',
                    'from-sky-400 to-sky-600',
                    'from-sky-400 to-sky-600'
                ];
                const colorScheme = colorSchemes[surah.number % colorSchemes.length];
                
                surahItem.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-gradient-to-r ${colorScheme} rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    ${number}
                                </div>
                                <div class="flex-1">
                                    <div class="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">
                                        ${primaryName}
                                    </div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <span>${secondaryName}</span>
                                        <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <span class="flex items-center gap-1">
                                            <i class="fas fa-star text-xs"></i>
                                            ${ayahCount} ${ayahText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${revelationType === 'Meccan' || revelationType === 'مكية' ? 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400' : 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400'} font-medium shadow-sm">
                            ${revelationType}
                        </div>
                    </div>
                `;
                
                // Use event delegation for better performance
                surahItem.dataset.surahIndex = surah.index;
                fragment.appendChild(surahItem);
            });
            
            // Single DOM append operation
            surahList.appendChild(fragment);
        }
        
        function selectSurah(surahIndex) {
            currentSurah = surahIndex;
                currentAyah = 0;
                isReadingMode = false;
                document.getElementById('btnReadingMode').innerHTML = '<i class="fas fa-book-open"></i>';
                
                // Clear target verse from search when manually selecting a surah
                targetVerseFromSearch = null;
            
            // Update button text
            const surah = quranData[surahIndex];
            const surahName = currentLang === 'ar' ? surah.name : surahNamesEnglish[surahIndex];
            document.getElementById('selectedSurahText').textContent = `${surah.number}. ${surahName}`;
            
            // Close side menu
            closeSurahMenu();
            
            // Hide quick surahs section when a surah is selected
            const quickSurahsSection = document.getElementById('quickSurahsSection');
            if (quickSurahsSection) {
                quickSurahsSection.style.display = 'none';
            }
            
            // Reset zoom on mobile devices immediately
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                        // Force a brief re-render to apply zoom reset
                        document.body.style.zoom = '1.0001';
                            document.body.style.zoom = '1';
                    }
            }
                
                // Load Tafsir for the selected surah
                if (isTafsirVisible) {
                loadTafsirForSurah(currentSurah + 1); // +1 because surah numbers start from 1
                }
                
                displayAyah();
        }

        // Function to load quick surah (from quick access buttons)
        function loadQuickSurah(surahNumber) {
            // Clear target verse from search when using quick surah access
            targetVerseFromSearch = null;
            
            // Ensure data is loaded
            if (!quranData) {
                // Show loading state
                const arabicText = document.getElementById('arabicText');
                arabicText.innerHTML = '<div class="text-gray-500 dark:text-gray-400 py-8"><i class="fas fa-spinner fa-spin text-2xl mb-4"></i><p>جاري التحميل...</p></div>';
                
                // Wait for data to load
                const checkData = setInterval(() => {
                    if (quranData) {
                        clearInterval(checkData);
                        selectSurah(surahNumber - 1); // Convert to 0-based index
                    }
                }, 50);
                return;
            }
            
            // Data is available, proceed with selection
            selectSurah(surahNumber - 1); // Convert to 0-based index
        }
        
        function openSurahMenu() {
            const sideMenu = document.getElementById('surahSideMenu');
            const overlay = document.getElementById('surahMenuOverlay');
            
            // Show menu immediately for better UX
            sideMenu.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            
            // Hide Quran controls when side menu is open
            const quranControls = getQuranControls();
            if (quranControls) {
                quranControls.classList.add('quran-controls-hidden');
            }
            
            // Initialize menu if not done yet
            if (surahsData.length === 0) {
                const surahList = document.getElementById('surahList');
                
                if (!quranData) {
                    // Show quick access list for immediate use
                    surahList.innerHTML = `
                        <div class="p-4 text-center border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-center justify-center gap-2 mb-2">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">
                                    ${currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                                </p>
                            </div>
                            <p class="text-gray-500 dark:text-gray-500 text-xs">
                                ${currentLang === 'ar' ? 'السور الشائعة متاحة أدناه' : 'Popular surahs available below'}
                            </p>
                        </div>
                    `;
                    
                    // Show popular surahs immediately
                    populateSurahList(quickSurahList);
                    
                    // Wait for full data to load, then show complete list
                    const checkDataInterval = setInterval(() => {
                        if (quranData) {
                            clearInterval(checkDataInterval);
                            initializeSurahMenu();
                        }
                    }, 50);
            } else {
                    // Data exists but menu not initialized
                    surahList.innerHTML = '<div class="p-4 text-center text-gray-500">جاري التحميل...</div>';
                        initializeSurahMenu();
                }
            }
            

        }
        
        function closeSurahMenu() {
            const sideMenu = document.getElementById('surahSideMenu');
            const overlay = document.getElementById('surahMenuOverlay');
            
            sideMenu.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            
            // Show Quran controls when side menu is closed
            const quranControls = getQuranControls();
            if (quranControls) {
                quranControls.classList.remove('quran-controls-hidden');
            }
            
            // Clear search
            document.getElementById('surahSearchInput').value = '';
            if (surahsData.length > 0) {
                populateSurahList(surahsData);
            }
        }
        
        // Function to remove Arabic diacritics and normalize Alef variants for better search
        function normalizeArabicText(text) {
            return text
                // Remove all Arabic diacritics and marks (comprehensive range)
                .replace(/[\u064B-\u0652\u0670\u0640\u06D6-\u06ED\u08F0-\u08FF]/g, '')
                // Remove Arabic-Indic digits and other marks
                .replace(/[\u06F0-\u06F9]/g, '')
                // Normalize Alef variants: أ إ آ ٱ -> ا
                .replace(/[أإآٱ]/g, 'ا')
                // Normalize Teh Marbuta: ة -> ه
                .replace(/ة/g, 'ه')
                // Remove "سُورَةُ" prefix if present
                .replace(/^سُورَةُ\s*/g, '')
                .replace(/^سورة\s*/g, '')
                // Remove extra spaces and normalize whitespace
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        // Function to create search variants for better Arabic matching
        function getSearchVariants(text) {
            const variants = new Set();
            const normalized = normalizeArabicText(text);
            
            // Add original text
            variants.add(text);
            variants.add(normalized);
            
            // Add version without definite article (ال)
            if (text.startsWith('ال')) {
                variants.add(text.substring(2));
                variants.add(normalizeArabicText(text.substring(2)));
            }
            
            // Add version with definite article if it doesn't have it
            if (!text.startsWith('ال') && text.length > 0) {
                variants.add('ال' + text);
                variants.add('ال' + normalized);
            }
            
            return Array.from(variants);
        }
        
        // Enhanced fuzzy search for surahs
        function searchSurahs(query) {
            if (!query.trim()) {
                // If no query, show full list if available, otherwise show quick list
                if (surahsData.length > 0) {
                    populateSurahList(surahsData);
                } else {
                    populateSurahList(quickSurahList);
                }
                return;
            }
            
            const searchTerm = query.trim();
            
            // Use full data if available, otherwise search in quick list
            const searchData = surahsData.length > 0 ? surahsData : quickSurahList;
            
            // Enhanced fuzzy matching with comprehensive scoring
            const scoredSurahs = searchData.map(surah => {
                const score = calculateComprehensiveSurahMatchScore(searchTerm, surah);
                return { ...surah, score };
            }).filter(surah => surah.score > 0);
            
            // Sort by score (highest first)
            scoredSurahs.sort((a, b) => b.score - a.score);
            
            // If no results in quick list but full data is loading, show a message
            if (scoredSurahs.length === 0 && surahsData.length === 0 && quranData) {
                const surahList = document.getElementById('surahList');
                surahList.innerHTML = `
                    <div class="p-4 text-center text-gray-500">
                        <p class="mb-2">${currentLang === 'ar' ? 'لم يتم العثور على نتائج في القائمة السريعة' : 'No results in quick list'}</p>
                        <p class="text-xs">${currentLang === 'ar' ? 'جاري تحميل القائمة الكاملة...' : 'Loading full list...'}</p>
                    </div>
                `;
                return;
            }
            
            populateSurahList(scoredSurahs);
        }
        
        // Calculate comprehensive match score for fuzzy search
        function calculateComprehensiveSurahMatchScore(searchTerm, surah) {
                const arabicName = surah.name || '';
                const englishName = surah.englishName || '';
            const number = surah.number.toString();
            
            let maxScore = 0;
            
            // Exact matches get highest score
            if (arabicName === searchTerm || englishName.toLowerCase() === searchTerm.toLowerCase() || number === searchTerm) {
                return 1000;
            }
            
            // Check number match
            if (number.includes(searchTerm)) {
                maxScore = Math.max(maxScore, 900);
            }
            
            // Get comprehensive search variants
            const searchVariants = generateComprehensiveSearchVariants(searchTerm);
            const surahVariants = generateComprehensiveSurahVariants(surah);
            
            // Check all combinations
            for (const searchVariant of searchVariants) {
                for (const surahVariant of surahVariants) {
                    const score = calculateStringMatchScore(searchVariant, surahVariant);
                    maxScore = Math.max(maxScore, score);
                }
            }
            
            // Additional similarity scoring based on character length and common patterns
            const similarityScore = calculateSimilarityScore(searchTerm, surah);
            maxScore = Math.max(maxScore, similarityScore);
            
            return maxScore;
        }
        
        // Generate comprehensive search term variants
        function generateComprehensiveSearchVariants(searchTerm) {
            const variants = new Set();
            const original = searchTerm.toLowerCase().trim();
            
            // Add original
            variants.add(original);
            
            // Remove common prefixes
            const prefixes = ['al-', 'al ', 'an-', 'an ', 'as-', 'as ', 'at-', 'at ', 'ar-', 'ar ', 
                             'surat ', 'surah ', 'سورة ', 'سوره '];
            prefixes.forEach(prefix => {
                if (original.startsWith(prefix)) {
                    variants.add(original.substring(prefix.length));
                }
            });
            
            // Add with common prefixes
            variants.add('al-' + original);
            variants.add('al ' + original);
            variants.add('an-' + original);
            variants.add('surat ' + original);
            variants.add('surah ' + original);
            
            // Handle Arabic variations
            if (isArabicText(original)) {
                variants.add(normalizeArabicText(original));
                
                // Handle definite article variations
                if (original.startsWith('ال')) {
                    variants.add(original.substring(2));
                } else {
                    variants.add('ال' + original);
                }
                
                // Handle Arabic numeral conversions
                const arabicNumerals = {
                    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
                    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
                };
                let converted = original;
                for (const [arabic, english] of Object.entries(arabicNumerals)) {
                    converted = converted.replace(new RegExp(arabic, 'g'), english);
                }
                if (converted !== original) {
                    variants.add(converted);
                }
            }
            
            // Handle transliteration variations
            const transliterationMap = {
                'waqia': 'waqi\'ah',
                'waqiah': 'waqi\'ah',
                'waqiyah': 'waqi\'ah',
                'waq': 'waqi\'ah',
                'al-waq': 'al-waqi\'ah',
                'alwaq': 'al-waqi\'ah',
                'ikhlas': 'ikhlas',
                'ikhlaas': 'ikhlas',
                'iklas': 'ikhlas',
                'class': 'ikhlas',
                'close': 'ikhlas',
                'nas': 'nas',
                'naas': 'nas',
                'people': 'nas',
                'mankind': 'nas',
                'falaq': 'falaq',
                'falaaq': 'falaq',
                'daybreak': 'falaq',
                'dawn': 'falaq',
                'fajr': 'fajr',
                'baqara': 'baqarah',
                'baqarah': 'baqarah',
                'bakara': 'baqarah',
                'cow': 'baqarah',
                'imran': 'imran',
                'ali imran': 'imran',
                'al imran': 'imran',
                'nisa': 'nisa',
                'nisaa': 'nisa',
                'women': 'nisa',
                'maidah': 'maidah',
                'maidaah': 'maidah',
                'table': 'maidah',
                'anam': 'anam',
                'anaam': 'anam',
                'cattle': 'anam',
                'araf': 'araf',
                'araaf': 'araf',
                'heights': 'araf',
                'anfal': 'anfal',
                'anfaal': 'anfal',
                'spoils': 'anfal',
                'tawbah': 'tawbah',
                'tawba': 'tawbah',
                'toba': 'tawbah',
                'repentance': 'tawbah',
                'yunus': 'yunus',
                'jonah': 'yunus',
                'jonas': 'yunus',
                'hud': 'hud',
                'yusuf': 'yusuf',
                'joseph': 'yusuf',
                'raad': 'raad',
                'ra\'ad': 'raad',
                'thunder': 'raad',
                'ibrahim': 'ibrahim',
                'abraham': 'ibrahim',
                'hijr': 'hijr',
                'nahl': 'nahl',
                'bee': 'nahl',
                'isra': 'isra',
                'israa': 'isra',
                'night journey': 'isra',
                'kahf': 'kahf',
                'cave': 'kahf',
                'maryam': 'maryam',
                'mary': 'maryam',
                'maria': 'maryam',
                'taha': 'taha',
                'ta-ha': 'taha',
                'anbiya': 'anbiya',
                'anbiyaa': 'anbiya',
                'prophets': 'anbiya',
                'hajj': 'hajj',
                'pilgrimage': 'hajj',
                'muminun': 'muminun',
                'mu\'minun': 'muminun',
                'believers': 'muminun',
                'nur': 'nur',
                'noor': 'nur',
                'light': 'nur',
                'furqan': 'furqan',
                'criterion': 'furqan',
                'shuara': 'shuara',
                'shu\'ara': 'shuara',
                'poets': 'shuara',
                'naml': 'naml',
                'ant': 'naml',
                'qasas': 'qasas',
                'stories': 'qasas',
                'ankabut': 'ankabut',
                'spider': 'ankabut',
                'rum': 'rum',
                'romans': 'rum',
                'luqman': 'luqman',
                'lukman': 'luqman',
                'sajda': 'sajda',
                'sajdah': 'sajda',
                'prostration': 'sajda',
                'ahzab': 'ahzab',
                'confederates': 'ahzab',
                'saba': 'saba',
                'sheba': 'saba',
                'fatir': 'fatir',
                'creator': 'fatir',
                'yasin': 'yasin',
                'ya-sin': 'yasin',
                'saffat': 'saffat',
                'ranks': 'saffat',
                'sad': 'sad',
                'zumar': 'zumar',
                'groups': 'zumar',
                'ghafir': 'ghafir',
                'forgiver': 'ghafir',
                'fussilat': 'fussilat',
                'explained': 'fussilat',
                'shura': 'shura',
                'consultation': 'shura',
                'zukhruf': 'zukhruf',
                'ornaments': 'zukhruf',
                'dukhan': 'dukhan',
                'smoke': 'dukhan',
                'jathiya': 'jathiya',
                'kneeling': 'jathiya',
                'ahqaf': 'ahqaf',
                'sand dunes': 'ahqaf',
                'muhammad': 'muhammad',
                'mohammed': 'muhammad',
                'mohamed': 'muhammad',
                'fath': 'fath',
                'victory': 'fath',
                'hujurat': 'hujurat',
                'chambers': 'hujurat',
                'qaf': 'qaf',
                'dhariyat': 'dhariyat',
                'winds': 'dhariyat',
                'tur': 'tur',
                'mount': 'tur',
                'najm': 'najm',
                'star': 'najm',
                'qamar': 'qamar',
                'moon': 'qamar',
                'rahman': 'rahman',
                'most merciful': 'rahman',
                'waqia': 'waqia',
                'waqi\'ah': 'waqia',
                'event': 'waqia',
                'hadid': 'hadid',
                'iron': 'hadid',
                'mujadila': 'mujadila',
                'pleading': 'mujadila',
                'hashr': 'hashr',
                'exile': 'hashr',
                'mumtahina': 'mumtahina',
                'examined': 'mumtahina',
                'saff': 'saff',
                'ranks': 'saff',
                'jumua': 'jumua',
                'jumu\'ah': 'jumua',
                'friday': 'jumua',
                'munafiqun': 'munafiqun',
                'hypocrites': 'munafiqun',
                'taghabun': 'taghabun',
                'mutual loss': 'taghabun',
                'talaq': 'talaq',
                'divorce': 'talaq',
                'tahrim': 'tahrim',
                'prohibition': 'tahrim',
                'mulk': 'mulk',
                'sovereignty': 'mulk',
                'qalam': 'qalam',
                'pen': 'qalam',
                'haqqah': 'haqqah',
                'reality': 'haqqah',
                'maarij': 'maarij',
                'ascending': 'maarij',
                'nuh': 'nuh',
                'noah': 'nuh',
                'jinn': 'jinn',
                'muzzammil': 'muzzammil',
                'wrapped': 'muzzammil',
                'muddathir': 'muddathir',
                'cloaked': 'muddathir',
                'qiyama': 'qiyama',
                'qiyamah': 'qiyama',
                'resurrection': 'qiyama',
                'insan': 'insan',
                'man': 'insan',
                'mursalat': 'mursalat',
                'sent forth': 'mursalat',
                'naba': 'naba',
                'news': 'naba',
                'naziat': 'naziat',
                'pullers': 'naziat',
                'abasa': 'abasa',
                'frowned': 'abasa',
                'takwir': 'takwir',
                'folding': 'takwir',
                'infitar': 'infitar',
                'cleaving': 'infitar',
                'mutaffifin': 'mutaffifin',
                'defrauding': 'mutaffifin',
                'inshiqaq': 'inshiqaq',
                'splitting': 'inshiqaq',
                'buruj': 'buruj',
                'constellations': 'buruj',
                'tariq': 'tariq',
                'night comer': 'tariq',
                'ala': 'ala',
                'a\'la': 'ala',
                'most high': 'ala',
                'ghashiya': 'ghashiya',
                'overwhelming': 'ghashiya',
                'shams': 'shams',
                'sun': 'shams',
                'layl': 'layl',
                'night': 'layl',
                'duha': 'duha',
                'morning': 'duha',
                'sharh': 'sharh',
                'expansion': 'sharh',
                'tin': 'tin',
                'fig': 'tin',
                'alaq': 'alaq',
                'clot': 'alaq',
                'qadr': 'qadr',
                'power': 'qadr',
                'bayyina': 'bayyina',
                'evidence': 'bayyina',
                'zalzala': 'zalzala',
                'earthquake': 'zalzala',
                'adiyat': 'adiyat',
                'chargers': 'adiyat',
                'qaria': 'qaria',
                'qari\'ah': 'qaria',
                'calamity': 'qaria',
                'takathur': 'takathur',
                'competition': 'takathur',
                'asr': 'asr',
                'time': 'asr',
                'humaza': 'humaza',
                'slanderer': 'humaza',
                'fil': 'fil',
                'elephant': 'fil',
                'quraysh': 'quraysh',
                'maun': 'maun',
                'assistance': 'maun',
                'kawthar': 'kawthar',
                'abundance': 'kawthar',
                'kafirun': 'kafirun',
                'disbelievers': 'kafirun',
                'nasr': 'nasr',
                'help': 'nasr',
                'masad': 'masad',
                'palm fiber': 'masad',
                'lahab': 'lahab',
                'flame': 'lahab'
            };
            
            // Add transliteration variants
            for (const [key, value] of Object.entries(transliterationMap)) {
                if (original.includes(key)) {
                    variants.add(original.replace(key, value));
                }
                if (original === key) {
                    variants.add(value);
                }
            }
            
            // Add partial matches for longer terms
            if (original.length > 3) {
                for (let i = 3; i <= original.length; i++) {
                    variants.add(original.substring(0, i));
                }
            }
            
            return Array.from(variants);
        }
        
        // Generate comprehensive surah name variants
        function generateComprehensiveSurahVariants(surah) {
            const variants = new Set();
            const arabicName = surah.name || '';
            const englishName = surah.englishName || '';
            
            // Add original names
            variants.add(arabicName.toLowerCase());
            variants.add(englishName.toLowerCase());
            
            // Add normalized Arabic
            if (arabicName) {
                variants.add(normalizeArabicText(arabicName));
            }
            
            // Add without common prefixes
            const prefixes = ['al-', 'an-', 'as-', 'at-', 'ar-', 'the '];
            prefixes.forEach(prefix => {
                if (englishName.toLowerCase().startsWith(prefix)) {
                    variants.add(englishName.toLowerCase().substring(prefix.length));
                }
            });
            
            // Add comprehensive transliteration variants for all surahs
            const comprehensiveTransliterations = {
                'الفاتحة': ['fatiha', 'fatihah', 'opening'],
                'البقرة': ['baqara', 'baqarah', 'bakara', 'cow'],
                'آل عمران': ['imran', 'ali imran', 'al imran'],
                'النساء': ['nisa', 'nisaa', 'women'],
                'المائدة': ['maidah', 'maidaah', 'table'],
                'الأنعام': ['anam', 'anaam', 'cattle'],
                'الأعراف': ['araf', 'araaf', 'heights'],
                'الأنفال': ['anfal', 'anfaal', 'spoils'],
                'التوبة': ['tawbah', 'tawba', 'toba', 'repentance'],
                'يونس': ['yunus', 'jonah', 'jonas'],
                'هود': ['hud'],
                'يوسف': ['yusuf', 'joseph'],
                'الرعد': ['raad', 'ra\'ad', 'thunder'],
                'إبراهيم': ['ibrahim', 'abraham'],
                'الحجر': ['hijr'],
                'النحل': ['nahl', 'bee'],
                'الإسراء': ['isra', 'israa', 'night journey'],
                'الكهف': ['kahf', 'cave'],
                'مريم': ['maryam', 'mary', 'maria'],
                'طه': ['taha', 'ta-ha'],
                'الأنبياء': ['anbiya', 'anbiyaa', 'prophets'],
                'الحج': ['hajj', 'pilgrimage'],
                'المؤمنون': ['muminun', 'mu\'minun', 'believers'],
                'النور': ['nur', 'noor', 'light'],
                'الفرقان': ['furqan', 'criterion'],
                'الشعراء': ['shuara', 'shu\'ara', 'poets'],
                'النمل': ['naml', 'ant'],
                'القصص': ['qasas', 'stories'],
                'العنكبوت': ['ankabut', 'spider'],
                'الروم': ['rum', 'romans'],
                'لقمان': ['luqman', 'lukman'],
                'السجدة': ['sajda', 'sajdah', 'prostration'],
                'الأحزاب': ['ahzab', 'confederates'],
                'سبأ': ['saba', 'sheba'],
                'فاطر': ['fatir', 'creator'],
                'يس': ['yasin', 'ya-sin'],
                'الصافات': ['saffat', 'ranks'],
                'ص': ['sad'],
                'الزمر': ['zumar', 'groups'],
                'غافر': ['ghafir', 'forgiver'],
                'فصلت': ['fussilat', 'explained'],
                'الشورى': ['shura', 'consultation'],
                'الزخرف': ['zukhruf', 'ornaments'],
                'الدخان': ['dukhan', 'smoke'],
                'الجاثية': ['jathiya', 'kneeling'],
                'الأحقاف': ['ahqaf', 'sand dunes'],
                'محمد': ['muhammad', 'mohammed', 'mohamed'],
                'الفتح': ['fath', 'victory'],
                'الحجرات': ['hujurat', 'chambers'],
                'ق': ['qaf'],
                'الذاريات': ['dhariyat', 'winds'],
                'الطور': ['tur', 'mount'],
                'النجم': ['najm', 'star'],
                'القمر': ['qamar', 'moon'],
                'الرحمن': ['rahman', 'most merciful'],
                'الواقعة': ['waqia', 'waqi\'ah', 'waqiah', 'waqiyah', 'event'],
                'الحديد': ['hadid', 'iron'],
                'المجادلة': ['mujadila', 'pleading'],
                'الحشر': ['hashr', 'exile'],
                'الممتحنة': ['mumtahina', 'examined'],
                'الصف': ['saff', 'ranks'],
                'الجمعة': ['jumua', 'jumu\'ah', 'friday'],
                'المنافقون': ['munafiqun', 'hypocrites'],
                'التغابن': ['taghabun', 'mutual loss'],
                'الطلاق': ['talaq', 'divorce'],
                'التحريم': ['tahrim', 'prohibition'],
                'الملك': ['mulk', 'sovereignty'],
                'القلم': ['qalam', 'pen'],
                'الحاقة': ['haqqah', 'reality'],
                'المعارج': ['maarij', 'ascending'],
                'نوح': ['nuh', 'noah'],
                'الجن': ['jinn'],
                'المزمل': ['muzzammil', 'wrapped'],
                'المدثر': ['muddathir', 'cloaked'],
                'القيامة': ['qiyama', 'qiyamah', 'resurrection'],
                'الإنسان': ['insan', 'man'],
                'المرسلات': ['mursalat', 'sent forth'],
                'النبأ': ['naba', 'news'],
                'النازعات': ['naziat', 'pullers'],
                'عبس': ['abasa', 'frowned'],
                'التكوير': ['takwir', 'folding'],
                'الإنفطار': ['infitar', 'cleaving'],
                'المطففين': ['mutaffifin', 'defrauding'],
                'الإنشقاق': ['inshiqaq', 'splitting'],
                'البروج': ['buruj', 'constellations'],
                'الطارق': ['tariq', 'night comer'],
                'الأعلى': ['ala', 'a\'la', 'most high'],
                'الغاشية': ['ghashiya', 'overwhelming'],
                'الفجر': ['fajr', 'dawn'],
                'البلد': ['balad', 'city'],
                'الشمس': ['shams', 'sun'],
                'الليل': ['layl', 'night'],
                'الضحى': ['duha', 'morning'],
                'الشرح': ['sharh', 'expansion'],
                'التين': ['tin', 'fig'],
                'العلق': ['alaq', 'clot'],
                'القدر': ['qadr', 'power'],
                'البينة': ['bayyina', 'evidence'],
                'الزلزلة': ['zalzala', 'earthquake'],
                'العاديات': ['adiyat', 'chargers'],
                'القارعة': ['qaria', 'qari\'ah', 'calamity'],
                'التكاثر': ['takathur', 'competition'],
                'العصر': ['asr', 'time'],
                'الهمزة': ['humaza', 'slanderer'],
                'الفيل': ['fil', 'elephant'],
                'قريش': ['quraysh'],
                'الماعون': ['maun', 'assistance'],
                'الكوثر': ['kawthar', 'abundance'],
                'الكافرون': ['kafirun', 'disbelievers'],
                'النصر': ['nasr', 'help'],
                'المسد': ['masad', 'lahab', 'palm fiber', 'flame'],
                'الإخلاص': ['ikhlas', 'ikhlaas', 'iklas', 'sincerity'],
                'الفلق': ['falaq', 'falaaq', 'daybreak'],
                'الناس': ['nas', 'naas', 'people', 'mankind']
            };
            
            // Add transliteration variants
            for (const [arabic, transliterations] of Object.entries(comprehensiveTransliterations)) {
                if (arabicName.includes(arabic)) {
                    transliterations.forEach(t => variants.add(t));
                }
            }
            
            // Add specific Arabic name mappings for better search
            const arabicNameMappings = {
                'الاخلاص': ['ikhlas', 'ikhlaas', 'iklas', 'sincerity', 'اخلاص', 'إخلاص'],
                'آل عمران': ['imran', 'ali imran', 'al imran', 'عمران', 'آل عمران', 'al-imran'],
                'البقرة': ['baqara', 'baqarah', 'bakara', 'cow', 'بقرة', 'البقرة'],
                'النساء': ['nisa', 'nisaa', 'women', 'نساء', 'النساء'],
                'الفاتحة': ['fatiha', 'fatihah', 'opening', 'فاتحة', 'الفاتحة'],
                'الرحمن': ['rahman', 'most merciful', 'رحمن', 'الرحمن'],
                'الناس': ['nas', 'naas', 'people', 'mankind', 'ناس', 'الناس'],
                'الفلق': ['falaq', 'falaaq', 'daybreak', 'فلق', 'الفلق'],
                'الكوثر': ['kawthar', 'abundance', 'كوثر', 'الكوثر'],
                'الكافرون': ['kafirun', 'disbelievers', 'كافرون', 'الكافرون'],
                'النصر': ['nasr', 'help', 'نصر', 'النصر'],
                'المسد': ['masad', 'lahab', 'palm fiber', 'flame', 'مسد', 'المسد'],
                'الإخلاص': ['ikhlas', 'ikhlaas', 'iklas', 'sincerity', 'اخلاص', 'إخلاص'],
                'الفلق': ['falaq', 'falaaq', 'daybreak', 'فلق', 'الفلق'],
                'الناس': ['nas', 'naas', 'people', 'mankind', 'ناس', 'الناس']
            };
            
            // Add Arabic name mappings
            for (const [arabic, mappings] of Object.entries(arabicNameMappings)) {
                if (arabicName.includes(arabic) || arabic.includes(arabicName)) {
                    mappings.forEach(mapping => variants.add(mapping));
                }
            }
            
            return Array.from(variants);
        }
        
        // Calculate string match score
        function calculateStringMatchScore(search, target) {
            if (!search || !target) return 0;
            
            const searchLower = search.toLowerCase();
            const targetLower = target.toLowerCase();
            
            // Exact match
            if (searchLower === targetLower) return 800;
            
            // Starts with
            if (targetLower.startsWith(searchLower)) return 700;
            
            // Contains
            if (targetLower.includes(searchLower)) return 600;
            
            // Partial match at word boundaries
            const searchWords = searchLower.split(/\s+/);
            const targetWords = targetLower.split(/\s+/);
            
            let wordMatches = 0;
            for (const searchWord of searchWords) {
                for (const targetWord of targetWords) {
                    if (targetWord.startsWith(searchWord)) {
                        wordMatches++;
                        break;
                    }
                }
            }
            
            if (wordMatches > 0) {
                return 500 + (wordMatches * 50);
            }
            
            // Fuzzy match using edit distance
            const editDistance = levenshteinDistance(searchLower, targetLower);
            const maxLength = Math.max(searchLower.length, targetLower.length);
            
            if (editDistance <= 2 && maxLength > 3) {
                return 400 - (editDistance * 50);
            }
            if (editDistance <= 3 && maxLength > 5) {
                return 300 - (editDistance * 30);
            }
            
            return 0;
        }
        
        // Calculate similarity score based on character length and patterns
        function calculateSimilarityScore(searchTerm, surah) {
            const arabicName = surah.name || '';
            const englishName = surah.englishName || '';
            
            let maxScore = 0;
            
            // Check length similarity (closer lengths get higher scores)
            const searchLength = searchTerm.length;
            const arabicLength = arabicName.length;
            const englishLength = englishName.length;
            
            // Length similarity scoring
            const arabicLengthDiff = Math.abs(searchLength - arabicLength);
            const englishLengthDiff = Math.abs(searchLength - englishLength);
            
            if (arabicLengthDiff <= 2) {
                maxScore = Math.max(maxScore, 200 - (arabicLengthDiff * 50));
            }
            if (englishLengthDiff <= 2) {
                maxScore = Math.max(maxScore, 200 - (englishLengthDiff * 50));
            }
            
            // Check for common character patterns
            const searchChars = searchTerm.toLowerCase().split('').sort().join('');
            const arabicChars = arabicName.toLowerCase().split('').sort().join('');
            const englishChars = englishName.toLowerCase().split('').sort().join('');
            
            // Character pattern similarity
            const arabicCharSimilarity = calculateCharacterSimilarity(searchChars, arabicChars);
            const englishCharSimilarity = calculateCharacterSimilarity(searchChars, englishChars);
            
            maxScore = Math.max(maxScore, arabicCharSimilarity, englishCharSimilarity);
            
            // Check for word boundary matches
            const searchWords = searchTerm.toLowerCase().split(/\s+/);
            const englishWords = englishName.toLowerCase().split(/\s+/);
            
            let wordBoundaryScore = 0;
            for (const searchWord of searchWords) {
                for (const englishWord of englishWords) {
                    if (englishWord.includes(searchWord) || searchWord.includes(englishWord)) {
                        wordBoundaryScore += 100;
                    }
                }
            }
            maxScore = Math.max(maxScore, wordBoundaryScore);
            
            return maxScore;
        }
        
        // Calculate character similarity between two strings
        function calculateCharacterSimilarity(str1, str2) {
            if (!str1 || !str2) return 0;
            
            const chars1 = str1.split('');
            const chars2 = str2.split('');
            
            let commonChars = 0;
            let totalChars = Math.max(chars1.length, chars2.length);
            
            for (const char of chars1) {
                if (chars2.includes(char)) {
                    commonChars++;
                    // Remove the matched character to avoid double counting
                    const index = chars2.indexOf(char);
                    chars2.splice(index, 1);
                }
            }
            
            return (commonChars / totalChars) * 150;
        }
        
        // Levenshtein distance for fuzzy matching
        function levenshteinDistance(str1, str2) {
            const matrix = [];
            
            if (str1.length === 0) return str2.length;
            if (str2.length === 0) return str1.length;
            
            // Initialize matrix
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            
            // Fill matrix
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1, // substitution
                            matrix[i][j - 1] + 1,     // insertion
                            matrix[i - 1][j] + 1      // deletion
                        );
                    }
                }
            }
            
            return matrix[str2.length][str1.length];
        }
        
        // Check if text contains Arabic characters
        function isArabicText(text) {
            const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
            return arabicRegex.test(text);
        }
        
        // Convert Arabic numerals to regular numbers
        function convertArabicNumerals(text) {
            const arabicNumerals = {
                '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
                '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
            };
            return text.replace(/[٠-٩]/g, match => arabicNumerals[match]);
        }
        
        // Quran Search Functionality
        let quranSearchTimeout;
        let quranSearchResults = [];
        let targetVerseFromSearch = null; // Track the verse selected from search
        
         // Display default search suggestions
         function displayDefaultSuggestions() {
            const searchResults = document.getElementById('quranSearchResults');
            const defaultSuggestions = currentLang === 'ar' ? [
                { type: 'tip', text: 'ابحث باستخدام:', icon: 'fas fa-lightbulb' },
                { type: 'suggestion', text: 'اسم السورة (مثال: "البقرة")', icon: 'fas fa-book-open' },
                { type: 'suggestion', text: 'رقم الآية (مثال: "آية ١")', icon: 'fas fa-bookmark' },
                { type: 'suggestion', text: 'رقم الجزء (مثال: "جزء ١")', icon: 'fas fa-star' },
                { type: 'suggestion', text: 'رقم الصفحة (مثال: "صفحة ١")', icon: 'fas fa-file' }
            ] : [
                { type: 'tip', text: 'Try searching by:', icon: 'fas fa-lightbulb' },
                { type: 'suggestion', text: 'Surah name (e.g., "Al-Baqara")', icon: 'fas fa-book-open' },
                { type: 'suggestion', text: 'Verse number (e.g., "Verse 1")', icon: 'fas fa-bookmark' },
                { type: 'suggestion', text: 'Juz number (e.g., "Juz 1")', icon: 'fas fa-star' },
                { type: 'suggestion', text: 'Page number (e.g., "Page 1")', icon: 'fas fa-file' }
            ];

            const html = defaultSuggestions.map(suggestion => {
                if (suggestion.type === 'tip') {
                    return `
                        <div class="search-tip flex items-center p-2 text-gray-600 dark:text-gray-300">
                            <i class="${suggestion.icon} mr-2 text-blue-500"></i>
                            <span class="font-semibold">${suggestion.text}</span>
                    </div>
                `;
                }
                return `
                    <div class="search-result-item flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors duration-150">
                        <i class="${suggestion.icon} mr-3 text-gray-500 dark:text-gray-400 w-5"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${suggestion.text}</span>
                    </div>
                `;
            }).join('');

            searchResults.innerHTML = html;
            searchResults.classList.remove('hidden');

            // Add click handlers for suggestions
            const suggestionItems = searchResults.querySelectorAll('.search-result-item');
                        suggestionItems.forEach(item => {
                item.addEventListener('click', async () => {
                    const searchInput = document.getElementById('quranSearchInput');
                    // Extract the example from the suggestion text (text between quotes)
                    const example = item.textContent.match(/"([^"]+)"/);
                    if (example && example[1]) {
                        // Set the input value
                        searchInput.value = example[1];
                        // Create and dispatch an input event to trigger the search
                        const inputEvent = new Event('input', { bubbles: true });
                        searchInput.dispatchEvent(inputEvent);
                        // Also perform the search directly to ensure it happens
                        await performQuranSearch(example[1]);
                        // Hide the suggestions after search is complete
                        hideQuranSearchResults();
                    }
                });
            });
        }
        // Initialize Quran search
        function initializeQuranSearch() {
            const searchInput = document.getElementById('quranSearchInput');
            const searchResults = document.getElementById('quranSearchResults');
            const clearBtn = document.getElementById('quranSearchClearBtn');
            
            if (!searchInput) return;

            searchInput.addEventListener('click', function() {
                displayDefaultSuggestions();
            });
            // Search input event listener
            searchInput.addEventListener('input', function(e) {
                const query = e.target.value.trim();
                
                // Clear previous timeout
                if (quranSearchTimeout) {
                    clearTimeout(quranSearchTimeout);
                }
                
                // Show/hide clear button
                if (query.length > 0) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                    hideQuranSearchResults();
                    return;
                }
                
                // Debounce search
                quranSearchTimeout = setTimeout(async () => {
                    await performQuranSearch(query);
                }, 300);
            });
            
            // Handle keyboard navigation
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    hideQuranSearchResults();
                    searchInput.blur();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const firstResult = document.querySelector('#quranSearchResults .search-result-item');
                    if (firstResult) {
                        firstResult.click();
                    }
                }
            });
            
            // Hide results when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    hideQuranSearchResults();
                }
            });
        }
        
        // Perform Quran search
        async function performQuranSearch(query) {
            // If data isn't loaded yet, wait for it
            if (!quranData || !translationData) {
                try {
                    await loadQuranData();
                } catch (error) {
                    console.error('Failed to load Quran data:', error);
                    return;
                }
            }
            
            const results = [];
            const searchTerm = query.toLowerCase().trim();
            
            // Enhanced search patterns for verse, page and juz (support Arabic numerals)
            const verseMatch = searchTerm.match(/^(?:verse|آية|ایة|أية|اية)\s*(\d+|[٠-٩]+)$/i);
            const pageMatch = searchTerm.match(/^(page|صفحة)\s*(\d+|[٠-٩]+)$/i);
            const juzMatch = searchTerm.match(/^(juz|جزء)\s*(\d+|[٠-٩]+)$/i);
            
            // If it's a specific verse, page or juz search, prioritize those results
            if (verseMatch) {
                const targetVerse = parseInt(convertArabicNumerals(verseMatch[1]));
                // Find the verse by number
                for (let surahIndex = 0; surahIndex < quranData.length; surahIndex++) {
                    const surah = quranData[surahIndex];
                    if (!surah) continue;
                    
                    for (let ayahIndex = 0; ayahIndex < surah.ayahs.length; ayahIndex++) {
                        const ayah = surah.ayahs[ayahIndex];
                        if (ayah && ayah.numberInSurah === targetVerse) {
                            const translation = translationData[surahIndex];
                            const translationAyah = translation ? translation.ayahs[ayahIndex] : null;
                            
                            results.push({
                                surahIndex,
                                ayahIndex,
                                surah,
                                ayah,
                                translationAyah,
                                score: 1300, // Highest priority for exact verse match
                                matchType: 'verse_exact',
                                matchText: `Verse ${ayah.numberInSurah}`
                            });
                        }
                    }
                }
            } else if (pageMatch) {
                const targetPage = parseInt(convertArabicNumerals(pageMatch[2]));
                // Find the first verse on that page
                for (let surahIndex = 0; surahIndex < quranData.length; surahIndex++) {
                    const surah = quranData[surahIndex];
                    if (!surah) continue;
                    
                    for (let ayahIndex = 0; ayahIndex < surah.ayahs.length; ayahIndex++) {
                        const ayah = surah.ayahs[ayahIndex];
                        if (ayah && ayah.page === targetPage) {
                            const translation = translationData[surahIndex];
                            const translationAyah = translation ? translation.ayahs[ayahIndex] : null;
                            
                            results.push({
                                surahIndex,
                                ayahIndex,
                                surah,
                                ayah,
                                translationAyah,
                                score: 1200, // Highest priority for exact page match
                                matchType: 'page_exact',
                                matchText: `Page ${ayah.page}`
                            });
                            break; // Found first verse on this page
                        }
                    }
                    if (results.length > 0) break; // Found the page
                }
            } else if (juzMatch) {
                const targetJuz = parseInt(convertArabicNumerals(juzMatch[2]));
                // Find the first verse in that juz
                for (let surahIndex = 0; surahIndex < quranData.length; surahIndex++) {
                    const surah = quranData[surahIndex];
                    if (!surah) continue;
                    
                    for (let ayahIndex = 0; ayahIndex < surah.ayahs.length; ayahIndex++) {
                        const ayah = surah.ayahs[ayahIndex];
                        if (ayah && ayah.juz === targetJuz) {
                            const translation = translationData[surahIndex];
                            const translationAyah = translation ? translation.ayahs[ayahIndex] : null;
                            
                            results.push({
                                surahIndex,
                                ayahIndex,
                                surah,
                                ayah,
                                translationAyah,
                                score: 1100, // High priority for exact juz match
                                matchType: 'juz_exact',
                                matchText: `Juz ${ayah.juz}`
                            });
                            break; // Found first verse in this juz
                        }
                    }
                    if (results.length > 0) break; // Found the juz
                }
            } else {
                // First check for surah name matches
                for (let surahIndex = 0; surahIndex < quranData.length; surahIndex++) {
                    const surah = quranData[surahIndex];
                    if (!surah) continue;

                    // Check surah name
                    const normalizedSearchTerm = normalizeArabicText(searchTerm);
                    const normalizedSurahName = normalizeArabicText(surah.name);
                    const normalizedEnglishName = surah.englishName.toLowerCase();
                    
                    if (normalizedSurahName.includes(normalizedSearchTerm) || 
                        normalizedEnglishName.includes(searchTerm)) {
                        // Add first verse of the surah as result
                        const translation = translationData[surahIndex];
                        if (translation && translation.ayahs[0] && surah.ayahs[0]) {
                            results.push({
                                surahIndex,
                                ayahIndex: 0,
                                surah,
                                ayah: surah.ayahs[0],
                                translationAyah: translation.ayahs[0],
                                score: 1400, // Higher than verse matches
                                matchType: 'surah',
                                matchText: `${surah.name} / ${surah.englishName}`
                            });
                        }
                    }
                }

                // Then search through verses
                for (let surahIndex = 0; surahIndex < quranData.length; surahIndex++) {
                    const surah = quranData[surahIndex];
                    const translation = translationData[surahIndex];
                    
                    if (!surah || !translation) continue;
                    
                    for (let ayahIndex = 0; ayahIndex < surah.ayahs.length; ayahIndex++) {
                        const ayah = surah.ayahs[ayahIndex];
                        const translationAyah = translation.ayahs[ayahIndex];
                        
                        if (!ayah || !translationAyah) continue;
                        
                        let score = 0;
                        let matchType = '';
                        let matchText = '';
                        
                        // Check verse number
                        if (ayah.numberInSurah.toString().includes(searchTerm) || 
                            ayah.numberInSurah.toString() === searchTerm) {
                            score = 1000;
                            matchType = 'verse';
                            matchText = `Verse ${ayah.numberInSurah}`;
                        }
                        
                        // Check page number
                        else if (ayah.page && ayah.page.toString().includes(searchTerm)) {
                            score = 900;
                            matchType = 'page';
                            matchText = `Page ${ayah.page}`;
                        }
                        
                        // Check juz number
                        else if (ayah.juz && ayah.juz.toString().includes(searchTerm)) {
                            score = 800;
                            matchType = 'juz';
                            matchText = `Juz ${ayah.juz}`;
                        }
                        
                        // Check Arabic text
                        else if (ayah.text.toLowerCase().includes(searchTerm)) {
                            score = 700;
                            matchType = 'arabic';
                            matchText = ayah.text.substring(0, 100) + (ayah.text.length > 100 ? '...' : '');
                        }
                        
                        // Check translation text
                        else if (translationAyah.text.toLowerCase().includes(searchTerm)) {
                            score = 600;
                            matchType = 'translation';
                            matchText = translationAyah.text.substring(0, 100) + (translationAyah.text.length > 100 ? '...' : '');
                        }
                        
                        // Check verse text (removed surah name check as it's done above)
                        
                        // Fuzzy search for Arabic text
                        else if (isArabicText(searchTerm)) {
                            const arabicText = normalizeArabicText(ayah.text);
                            const normalizedSearch = normalizeArabicText(searchTerm);
                            
                            if (arabicText.includes(normalizedSearch)) {
                                score = 400;
                                matchType = 'arabic_fuzzy';
                                matchText = ayah.text.substring(0, 100) + (ayah.text.length > 100 ? '...' : '');
                            }
                        }
                        
                        if (score > 0) {
                            results.push({
                                surahIndex,
                                ayahIndex,
                                surah,
                                ayah,
                                translationAyah,
                                score,
                                matchType,
                                matchText
                            });
                        }
                    }
                }
            }
            
            // Sort by score and limit results
            results.sort((a, b) => b.score - a.score);
            quranSearchResults = results.slice(0, 20); // Limit to 20 results
            
            displayQuranSearchResults();
        }
        
        // Display search results
        function displayQuranSearchResults() {
            const resultsContainer = document.getElementById('quranSearchResults');
            
            if (!resultsContainer || quranSearchResults.length === 0) {
                hideQuranSearchResults();
                return;
            }
            
            // Hide Quran controls when search results are shown
            const quranControls = getQuranControls();
            if (quranControls) {
                quranControls.classList.add('quran-controls-hidden');
            }
            
            let html = '';
            
            quranSearchResults.forEach((result, index) => {
                const surahName = currentLang === 'ar' ? result.surah.name : result.surah.englishName;
                const matchTypeIcon = getMatchTypeIcon(result.matchType);
                const matchTypeText = getMatchTypeText(result.matchType);
                
                html += `
                    <div class="search-result-item p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
                         onclick="goToQuranVerse(${result.surahIndex}, ${result.ayahIndex})"
                         data-surah="${result.surahIndex}" 
                         data-ayah="${result.ayahIndex}">
                        <div class="flex items-start gap-3">
                            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ${result.ayah.numberInSurah}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        ${surahName}
                                    </span>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">
                                        ${currentLang === 'ar' ? 'آية' : 'Verse'} ${result.ayah.numberInSurah}
                                    </span>
                                    <span class="text-xs text-gray-400 dark:text-gray-500">
                                        ${matchTypeIcon} ${matchTypeText}
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600 dark:text-gray-300 mb-1" dir="rtl">
                                    ${result.ayah.text.substring(0, 80)}${result.ayah.text.length > 80 ? '...' : ''}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">
                                    ${result.translationAyah.text.substring(0, 60)}${result.translationAyah.text.length > 60 ? '...' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = html;
            resultsContainer.classList.remove('hidden');
        }
        
        // Get match type icon
        function getMatchTypeIcon(matchType) {
            const icons = {
                'verse': '🔢',
                'page': '📄',
                'page_exact': '📄',
                'juz': '📚',
                'juz_exact': '📚',
                'arabic': '📖',
                'translation': '🌐',
                'surah': '📋',
                'arabic_fuzzy': '🔍'
            };
            return icons[matchType] || '🔍';
        }
        
        // Get match type text
        function getMatchTypeText(matchType) {
            const texts = {
                'verse': currentLang === 'ar' ? 'رقم الآية' : 'Verse Number',
                'page': currentLang === 'ar' ? 'رقم الصفحة' : 'Page Number',
                'page_exact': currentLang === 'ar' ? 'الصفحة المحددة' : 'Exact Page',
                'juz': currentLang === 'ar' ? 'رقم الجزء' : 'Juz Number',
                'juz_exact': currentLang === 'ar' ? 'الجزء المحدد' : 'Exact Juz',
                'arabic': currentLang === 'ar' ? 'النص العربي' : 'Arabic Text',
                'translation': currentLang === 'ar' ? 'الترجمة' : 'Translation',
                'surah': currentLang === 'ar' ? 'اسم السورة' : 'Surah Name',
                'arabic_fuzzy': currentLang === 'ar' ? 'بحث تقريبي' : 'Fuzzy Search'
            };
            return texts[matchType] || '';
        }
        
        // Go to specific verse
        function goToQuranVerse(surahIndex, ayahIndex) {
            // Switch to Quran tab if not already there
            if (!document.getElementById('quranContent').classList.contains('active')) {
                switchTab('quran');
            }
            
            // Set current surah and ayah
            currentSurah = surahIndex;
            currentAyah = ayahIndex;
            
            // If we're in reading mode, stay in reading mode
            const wasInReadingMode = isReadingMode;
            if (!wasInReadingMode) {
                isReadingMode = false;
                // Update reading mode button
                const btn = document.getElementById('btnReadingMode');
                btn.innerHTML = '<i class="fas fa-book-open"></i>';
                btn.removeAttribute('title');
                const tooltipText = languages[currentLang].displayFullSurah;
                btn.setAttribute('data-tooltip', tooltipText);
                btn.classList.add('show-tooltip');
            }
            
            // Store the target verse for when user switches to full surah mode
            targetVerseFromSearch = { surahIndex, ayahIndex };
            
            // Update surah menu button
            const surah = quranData[surahIndex];
            const surahName = currentLang === 'ar' ? surah.name : surah.englishName;
            document.getElementById('selectedSurahText').textContent = `${surah.number}. ${surahName}`;
            
            // Display the verse based on mode
            if (wasInReadingMode) {
                loadReadingModeAyahs();
                displayReadingModeAyahsByPages(true, null, targetVerseFromSearch);
            } else {
                displayAyah();
            }
            
            // Hide quick surahs section
            const quickSurahsSection = document.getElementById('quickSurahsSection');
            if (quickSurahsSection) {
                quickSurahsSection.style.display = 'none';
            }
            
            // Hide search results
            hideQuranSearchResults();
            
            // Clear search input
            document.getElementById('quranSearchInput').value = '';
            document.getElementById('quranSearchClearBtn').classList.add('hidden');
            
            // Show success message
            const ayah = quranData[surahIndex].ayahs[ayahIndex];
            showToast(
                currentLang === 'ar' 
                    ? `تم الانتقال إلى ${surahName} - آية ${ayah.numberInSurah}` 
                    : `Navigated to ${surahName} - Verse ${ayah.numberInSurah}`,
                'success'
            );
        }
        
        // Hide search results
        function hideQuranSearchResults() {
            const resultsContainer = document.getElementById('quranSearchResults');
            if (resultsContainer) {
                resultsContainer.classList.add('hidden');
            }
            
            // Show Quran controls when search results are hidden
            const quranControls = getQuranControls();
            if (quranControls) {
                quranControls.classList.remove('quran-controls-hidden');
            }
        }
        
        // Clear search
        function clearQuranSearch() {
            const searchInput = document.getElementById('quranSearchInput');
            const clearBtn = document.getElementById('quranSearchClearBtn');
            
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            
            if (clearBtn) {
                clearBtn.classList.add('hidden');
            }
            
            hideQuranSearchResults();
        }
  

        // Utility to get the verse closest to the center of the viewport
        function getCenteredVerseId() {
            const verses = document.querySelectorAll('[id^="verse-"]');
            const viewportCenter = window.scrollY + window.innerHeight / 2;
            let closestId = null;
            let minDist = Infinity;
            verses.forEach(verse => {
                const rect = verse.getBoundingClientRect();
                const verseCenter = rect.top + window.scrollY + rect.height / 2;
                const dist = Math.abs(verseCenter - viewportCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closestId = verse.id;
                }
            });
            return closestId;
        }

        // Update playAyahAudio to toggle play/pause and handle interruptions with debounce
        function playAyahAudio(surah, ayah) {
            // Prevent multiple rapid clicks with a debounce flag
            if (window.isPlayingAudio) {
                return;
            }
            window.isPlayingAudio = true;

            // If the same ayah is playing, pause it (do not restart)
            if (window.currentAyahAudio && currentAudioSurah === surah && currentAudioAyah === ayah && !window.currentAyahAudio.paused) {
                window.currentAyahAudio.pause();
                updateAyahHighlights();
                window.isPlayingAudio = false;
                return;
            }
            // Pause and reset any currently playing audio
            if (window.currentAyahAudio) {
                window.currentAyahAudio.pause();
                window.currentAyahAudio = null;
            }
            // Pad numbers to 3 digits
            const surahStr = (Number(surah) + 1).toString().padStart(3, '0');
            const ayahStr = (Number(ayah) + 1).toString().padStart(3, '0');
            
            // Get selected reciter from settings
            const reciterMapping = {
                'ar.alafasy': 'Alafasy_64kbps',
                'ar.husary': 'Husary_64kbps',
                'ar.minshawi': 'Minshawy_Murattal_128kbps',
                'ar.sudais': 'Abdurrahmaan_As-Sudais_64kbps',
                'ar.shuraim': 'Saood_ash-Shuraym_64kbps'
            };
            
            const selectedReciter = currentReciter || 'ar.alafasy';
            const reciter = reciterMapping[selectedReciter] || 'Alafasy_64kbps';
            const url = `https://everyayah.com/data/${reciter}/${surahStr}${ayahStr}.mp3`;
            const audio = new Audio(url);
            console.log(url);   
            
            // Enhanced iOS PWA audio setup
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isPWA = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
            
            if (isIOS) {
                // Set audio attributes for better iOS PWA compatibility
                audio.preload = 'auto';
                audio.setAttribute('playsinline', 'true');
                audio.setAttribute('webkit-playsinline', 'true');
                audio.setAttribute('controls', 'false');
                audio.muted = false;
                audio.volume = 1.0;
                
                // For iOS PWA, we need to ensure audio context is unlocked
                if (isPWA) {
                    // Create a silent audio context to unlock audio
                    try {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        if (AudioContext) {
                            const audioContext = new AudioContext();
                            if (audioContext.state === 'suspended') {
                                audioContext.resume();
                            }
                        }
                    } catch (e) {
                        console.log('Audio context setup failed:', e);
                    }
                }
            }
            
            // Apply playback speed from settings
            audio.playbackRate = currentPlaybackSpeed || 1;
            
            window.currentAyahAudio = audio;
            currentAudioSurah = surah;
            currentAudioAyah = ayah;
            // Use a promise to handle play to avoid AbortError
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updateAyahHighlights();
                    window.isPlayingAudio = false;
                }).catch(error => {
                    console.error("Audio play error:", error);
                    
                    // Enhanced iOS PWA error handling
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    const isPWA = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
                    
                    if (isIOS && isPWA) {
                        if (error.name === 'NotAllowedError') {
                            showToast(currentLang === 'ar' ? 'يرجى النقر على الآية مرة أخرى لتشغيل الصوت في التطبيق' : 'Please tap the verse again to play audio in the app', 'info');
                        } else if (error.name === 'AbortError') {
                            // User cancelled or audio was interrupted
                            console.log('Audio playback was interrupted');
                        } else {
                            showToast(currentLang === 'ar' ? 'حدث خطأ في تشغيل الصوت في التطبيق' : 'Error playing audio in the app', 'error');
                        }
                    } else if (isIOS) {
                        if (error.name === 'NotAllowedError') {
                        showToast(currentLang === 'ar' ? 'يرجى النقر على الآية مرة أخرى لتشغيل الصوت' : 'Please tap the verse again to play audio', 'info');
                        } else {
                            showToast(currentLang === 'ar' ? 'حدث خطأ أثناء تشغيل الصوت' : 'Error playing audio', 'error');
                        }
                    } else {
                        showToast(currentLang === 'ar' ? 'حدث خطأ أثناء تشغيل الصوت' : 'Error playing audio', 'error');
                    }
                    
                    currentAudioSurah = null;
                    currentAudioAyah = null;
                    window.currentAyahAudio = null;
                    updateAyahHighlights();
                    window.isPlayingAudio = false;
                });
            } else {
                // Fallback for older browsers
                updateAyahHighlights();
                window.isPlayingAudio = false;
            }
            updateAyahHighlights();
            audio.onended = () => {
                // Check if single verse loop is enabled first (highest priority)
                if (isSingleVerseLoop) {
                    // Reset current audio state first
                    currentAudioSurah = null;
                    currentAudioAyah = null;
                    window.currentAyahAudio = null;
                    updateAyahHighlights();
                    window.isPlayingAudio = false;
                    
                    // For iOS, we need to reuse the same audio object to avoid playback restrictions
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    
                    if (isIOS) {
                        // On iOS, reuse the same audio object and reset it
                        singleVerseLoopTimeout = setTimeout(() => {
                            try {
                                if (audio && !audio.paused) {
                                    audio.pause();
                                }
                                audio.currentTime = 0;
                                window.currentAyahAudio = audio;
                                currentAudioSurah = surah;
                                currentAudioAyah = ayah;
                                
                                const replayPromise = audio.play();
                                if (replayPromise !== undefined) {
                                    replayPromise.then(() => {
                                        updateAyahHighlights();
                                        window.isPlayingAudio = false;
                                    }).catch(error => {
                                        console.error("iOS Audio replay error:", error);
                                        // Fallback: try creating a new audio object
                                        currentAudioSurah = null;
                                        currentAudioAyah = null;
                                        window.currentAyahAudio = null;
                                        window.isPlayingAudio = false;
                                        playAyahAudio(surah, ayah);
                                    });
                                } else {
                                    updateAyahHighlights();
                                    window.isPlayingAudio = false;
                                }
                            } catch (error) {
                                console.error("iOS Audio setup error:", error);
                                // Fallback: try creating a new audio object
                                currentAudioSurah = null;
                                currentAudioAyah = null;
                                window.currentAyahAudio = null;
                                window.isPlayingAudio = false;
                                playAyahAudio(surah, ayah);
                            }
                        }, 1000);
                    } else {
                        // Non-iOS devices: create new audio object
                        singleVerseLoopTimeout = setTimeout(() => {
                            playAyahAudio(surah, ayah);
                        }, 1000);
                    }
                    return;
                }
                
                // Check if continuous play is enabled and we're not at the end of the surah
                if (isContinuousPlayEnabled && quranData && quranData[surah]) {
                    const currentSurahData = quranData[surah];
                    const nextAyah = ayah + 1;
                    
                    // If there's a next ayah in the current surah, play it
                    if (nextAyah < currentSurahData.ayahs.length) {
                        // Reset current audio state first
                        currentAudioSurah = null;
                        currentAudioAyah = null;
                        window.currentAyahAudio = null;
                        updateAyahHighlights();
                        window.isPlayingAudio = false;
                        
                        // Small delay to ensure proper state reset
                        setTimeout(() => {
                            playAyahAudio(surah, nextAyah);
                        }, 500);
                        return;
                    } else if (isContinuousPlayEnabled) {
                        // Reached end of surah with continuous play enabled
                        const surahName = quranData[surah]?.name || `Surah ${surah + 1}`;
                        const message = currentLang === 'ar' ? 
                            `انتهى تشغيل ${surahName}` : 
                            `Finished playing ${surahName}`;
                        showToast(message, 'info');
                    }
                }
                
                // Normal ending behavior (no continuous play or end of surah reached)
                currentAudioSurah = null;
                currentAudioAyah = null;
                window.currentAyahAudio = null;
                updateAyahHighlights();
                window.isPlayingAudio = false;
            };
        }

        // Enhanced audio context management for iOS background playback
        let globalAudioContext = null;
        let audioElements = new Map(); // Cache for audio elements
        let isAudioUnlocked = false;

        // Function to initialize audio context for iOS PWA
        function initializeAudioContext() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isPWA = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
            
            if (isIOS && isPWA) {
                // Create and resume audio context to unlock audio
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        globalAudioContext = new AudioContext();
                        
                        // Set audio session category for iOS
                        if (globalAudioContext.setSinkId) {
                            // This helps with iOS audio session management
                            console.log('Audio context initialized for iOS PWA');
                        }
                        
                        // Resume audio context if suspended
                        if (globalAudioContext.state === 'suspended') {
                            globalAudioContext.resume().then(() => {
                                console.log('Audio context resumed successfully');
                                isAudioUnlocked = true;
                            }).catch(e => {
                                console.log('Audio context resume failed:', e);
                            });
                        } else {
                            isAudioUnlocked = true;
                        }
                    }
                } catch (e) {
                    console.log('Audio context initialization failed:', e);
                }
                
                // Add user interaction handler to unlock audio
                const unlockAudio = () => {
                    try {
                        if (globalAudioContext && globalAudioContext.state === 'suspended') {
                            globalAudioContext.resume().then(() => {
                                console.log('Audio unlocked on user interaction');
                                isAudioUnlocked = true;
                            }).catch(e => {
                                console.log('Audio unlock failed:', e);
                            });
                        }
                        
                        // Preload audio elements for better performance
                        preloadAudioElements();
                        
                        // Remove the event listeners after first interaction
                        document.removeEventListener('touchstart', unlockAudio);
                        document.removeEventListener('click', unlockAudio);
                    } catch (e) {
                        console.log('Audio unlock failed:', e);
                    }
                };
                
                // Listen for first user interaction
                document.addEventListener('touchstart', unlockAudio, { once: true });
                document.addEventListener('click', unlockAudio, { once: true });
                
                // Also listen for visibility changes to handle background/foreground transitions
                document.addEventListener('visibilitychange', handleVisibilityChange);
            }
        }

        // Handle visibility changes for iOS background audio and pending notifications
        function handleVisibilityChange() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS && globalAudioContext) {
                if (document.hidden) {
                    // App going to background - ensure audio context stays active
                    if (globalAudioContext.state === 'suspended') {
                        globalAudioContext.resume().catch(e => {
                            console.log('Failed to resume audio context on background:', e);
                        });
                    }
                } else {
                    // App coming to foreground - resume audio context
                    if (globalAudioContext.state === 'suspended') {
                        globalAudioContext.resume().then(() => {
                            console.log('Audio context resumed on foreground');
                            isAudioUnlocked = true;
                        }).catch(e => {
                            console.log('Failed to resume audio context on foreground:', e);
                        });
                    }
                }
            }
            
            // Check for pending notifications when app becomes visible
            if (!document.hidden) {
                checkPendingNotifications();
            }
        }
        


        // Preload audio elements for better performance
        function preloadAudioElements() {
            const audioFiles = [
                'sounds/adhan.mp3',
                'sounds/adhan_egypt.mp3',
                'sounds/adhan_madinah.mp3',
                'sounds/adhan_makkah.mp3',
                'sounds/adhan_morocco.mp3',
                'sounds/adhan_turkey.mp3'
            ];

            audioFiles.forEach(audioFile => {
                if (!audioElements.has(audioFile)) {
                    const audio = new Audio(audioFile);
                    audio.preload = 'auto';
                    audio.volume = 0.5;
                    audioElements.set(audioFile, audio);
                }
            });
        }

        // Enhanced audio playback function for iOS background compatibility
        function playAudioWithFallback(audioPath, volume = 0.5) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            
            return new Promise((resolve, reject) => {
                try {
                    // Try to use cached audio element first
                    let audio = audioElements.get(audioPath);
                    
                    if (!audio) {
                        audio = new Audio(audioPath);
                        audio.preload = 'auto';
                        audioElements.set(audioPath, audio);
                    }
                    
                    // Reset audio to beginning
                    audio.currentTime = 0;
                    audio.volume = volume;
                    
                    // For iOS, ensure audio context is active
                    if (isIOS && globalAudioContext && globalAudioContext.state === 'suspended') {
                        globalAudioContext.resume().then(() => {
                            return audio.play();
                        }).then(() => {
                            console.log('Audio played successfully with resumed context');
                            resolve(audio);
                        }).catch(error => {
                            console.error('Failed to play audio with resumed context:', error);
                            // Fallback to direct play
                            audio.play().then(() => resolve(audio)).catch(reject);
                        });
                    } else {
                        // Direct play for non-iOS or already active context
                        audio.play().then(() => {
                            console.log('Audio played successfully');
                            resolve(audio);
                        }).catch(error => {
                            console.error('Failed to play audio:', error);
                            reject(error);
                        });
                    }
                } catch (error) {
                    console.error('Error in playAudioWithFallback:', error);
                    reject(error);
                }
            });
        }

        // iOS-specific audio session management for background playback
        function setupIOSAudioSession() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (!isIOS) return;

            // Set up audio session for background playback
            if (globalAudioContext) {
                // Configure audio context for background playback
                globalAudioContext.suspend().then(() => {
                    return globalAudioContext.resume();
                }).then(() => {
                    console.log('iOS audio session configured for background playback');
                }).catch(error => {
                    console.error('Failed to configure iOS audio session:', error);
                });
            }

            // Add page visibility change handler for iOS
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // App going to background - keep audio context active
                    if (globalAudioContext && globalAudioContext.state === 'suspended') {
                        globalAudioContext.resume().catch(e => {
                            console.log('Failed to resume audio context on background:', e);
                        });
                    }
                } else {
                    // App coming to foreground - ensure audio context is active
                    if (globalAudioContext && globalAudioContext.state === 'suspended') {
                        globalAudioContext.resume().then(() => {
                            console.log('Audio context resumed on foreground');
                        }).catch(e => {
                            console.log('Failed to resume audio context on foreground:', e);
                        });
                    }
                }
            });

            // Add focus/blur handlers for better iOS audio management
            window.addEventListener('focus', () => {
                if (globalAudioContext && globalAudioContext.state === 'suspended') {
                    globalAudioContext.resume().catch(e => {
                        console.log('Failed to resume audio context on focus:', e);
                    });
                }
            });

            window.addEventListener('blur', () => {
                // Keep audio context active when window loses focus
                if (globalAudioContext && globalAudioContext.state === 'suspended') {
                    globalAudioContext.resume().catch(e => {
                        console.log('Failed to resume audio context on blur:', e);
                    });
                }
            });
        }

        // Dynamic sticky positioning calculation
        function updateStickyPositioning() {
            try {
                // Get actual header and tabs elements
                const header = document.querySelector('header');
                const tabs = document.querySelector('.flex.justify-center.bg-gradient-to-r');
                
                if (header && tabs) {
                    // Calculate actual heights (for potential future use)
                    const headerHeight = header.offsetHeight;
                    const tabsHeight = tabs.offsetHeight;
                    
                    // Update CSS custom properties
                    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
                    document.documentElement.style.setProperty('--tabs-height', `${tabsHeight}px`);
                    
                    console.log('Sticky positioning updated:', {
                        headerHeight,
                        tabsHeight
                    });
                }
            } catch (error) {
                console.error('Error updating sticky positioning:', error);
            }
        }

        // Enhanced audio playback specifically for iOS background notifications
        function playAdhanForNotification(audioPath, volume = 0.5) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            
            return new Promise((resolve, reject) => {
                try {
                    // Create a new audio element specifically for notifications
                    const audio = new Audio(audioPath);
                    audio.volume = volume;
                    audio.preload = 'auto';
                    
                    // For iOS, try multiple approaches to ensure audio plays
                    if (isIOS) {
                        // Approach 1: Try to resume audio context first
                        if (globalAudioContext && globalAudioContext.state === 'suspended') {
                            globalAudioContext.resume().then(() => {
                                return audio.play();
                            }).then(() => {
                                console.log('Adhan played with resumed audio context');
                                resolve(audio);
                            }).catch(error => {
                                console.log('Failed with resumed context, trying direct play');
                                // Approach 2: Direct play
                                audio.play().then(() => {
                                    console.log('Adhan played with direct play');
                                    resolve(audio);
                                }).catch(error2 => {
                                    console.log('Failed with direct play, trying with user interaction simulation');
                                    // Approach 3: Try to simulate user interaction
                                    document.body.click();
                                    setTimeout(() => {
                                        audio.play().then(() => {
                                            console.log('Adhan played with simulated interaction');
                                            resolve(audio);
                                        }).catch(reject);
                                    }, 100);
                                });
                            });
                        } else {
                            // Audio context is already active, try direct play
                            audio.play().then(() => {
                                console.log('Adhan played with active audio context');
                                resolve(audio);
                            }).catch(error => {
                                console.log('Failed with active context, trying with interaction simulation');
                                document.body.click();
                                setTimeout(() => {
                                    audio.play().then(() => {
                                        console.log('Adhan played with simulated interaction');
                                        resolve(audio);
                                    }).catch(reject);
                                }, 100);
                            });
                        }
                    } else {
                        // Non-iOS devices
                        audio.play().then(() => {
                            console.log('Adhan played on non-iOS device');
                            resolve(audio);
                        }).catch(reject);
                    }
                } catch (error) {
                    console.error('Error in playAdhanForNotification:', error);
                    reject(error);
                }
            });
        }

        // Function to attach event listeners to ayah elements
        window.attachAyahListeners = function() {
            document.querySelectorAll('.ayah').forEach(ayahElem => {
                ayahElem.addEventListener('click', function() {
                    const surah = this.getAttribute('data-surah');
                    const ayah = this.getAttribute('data-ayah');
                    playAyahAudio(parseInt(surah), parseInt(ayah));
                });
            });
        };

        // Update ayah highlighting based on current playing state
        function updateAyahHighlights() {
            document.querySelectorAll('.ayah').forEach(span => {
                const surah = span.getAttribute('data-surah');
                const ayah = span.getAttribute('data-ayah');
                if (Number(surah) === Number(currentAudioSurah) && Number(ayah) === Number(currentAudioAyah) && window.currentAyahAudio && !window.currentAyahAudio.paused) {
                    span.classList.add('ayah-playing');
                } else {
                    span.classList.remove('ayah-playing');
                }
            });
        }

        let prayerHighlightInterval = null;

        function updateNextPrayerHighlight() {
            if (!prayerNotifications || Object.keys(prayerNotifications).length === 0) {
                return;
            }

            const now = new Date();
            const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            let nextPrayerName = null;

            // Remove existing highlights and restore default backgrounds
            prayerOrder.forEach(prayer => {
                const prayerEl = document.getElementById(`azan-${prayer.toLowerCase()}`);
                if (prayerEl) {
                    prayerEl.classList.remove('next-prayer-highlight');
                    // Ensure default Tailwind backgrounds are present when not highlighted
                    prayerEl.classList.add('bg-gray-100', 'dark:bg-gray-700');
                }
            });

            for (const prayerName of prayerOrder) {
                const prayerTimeStr = prayerNotifications[prayerName];
                if (!prayerTimeStr) continue;

                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

                if (prayerDate > now) {
                    nextPrayerName = prayerName;
                    break;
                }
            }

            if (!nextPrayerName) {
                nextPrayerName = 'Fajr';
            }

            if (nextPrayerName) {
                const nextPrayerEl = document.getElementById(`azan-${nextPrayerName.toLowerCase()}`);
                if (nextPrayerEl) {
                    // Remove default Tailwind backgrounds before applying highlight
                    nextPrayerEl.classList.remove('bg-gray-100', 'dark:bg-gray-700');
                    nextPrayerEl.classList.add('next-prayer-highlight');
                }
                
                // Update coming prayer indicator
                updateComingPrayerIndicator(nextPrayerName);
            }
        }

        function setupPrayerHighlighting() {
            if (prayerHighlightInterval) {
                clearInterval(prayerHighlightInterval);
            }
            updateNextPrayerHighlight(); // Initial call
            prayerHighlightInterval = setInterval(updateNextPrayerHighlight, 60000); // Update every minute
        }

        // Add modal open/close logic and helper for button click
        function closeAdhkarMenuAndLoad(section) {
          document.getElementById('adhkarMenuModal').classList.add('hidden');
          loadAdhkar(section);
        }
    

      


function updateAzkarTypeLabels() {
  const types = [
    ['Morning', 'sabah'],
    ['Evening', 'masaa'],
    ['WakingSleeping', 'waking_sleeping'],
    ['Home', 'home'],
    ['Bathroom', 'bathroom'],
    ['Eating', 'eating'],
    ['Masjid', 'masjid'],
    ['Traveling', 'traveling'],
    ['Clothes', 'clothes'],
    ['Anxiety', 'anxiety'],
    ['Hardship', 'hardship'],
    ['Istighfar', 'istighfar'],
    ['PatienceGratitude', 'patience_gratitude'],
    ['Rabbana', 'rabbana'],
    ['Prophetic', 'prophetic'],
    ['Prophets', 'prophets'],
    ['Rain', 'rain'],
    ['Patient', 'patient'],
    ['Deceased', 'deceased'],
    ['MarriageChildrenRizq', 'marriage_children_rizq'],
    ['Protection', 'protection'],
    ['Salah', 'salah'],
    ['SujoodTashahhud', 'sujood_tashahhud'],
    ['Qunoot', 'qunoot'],
    ['Tahajjud', 'tahajjud'],
    ['Istikhara', 'istikhara'],
    ['Ramadan', 'ramadan'],
    ['Hajj', 'hajj'],
    ['LaylatAlQadr', 'laylat_al_qadr'],
    ['Eid', 'eid'],
    ['NaturalEvents', 'natural_events']
  ];
  types.forEach(([labelIdPrefix, typeKey]) => {
    const el = document.getElementById('label' + labelIdPrefix);
    if (el) {
      // Set text content first
      if (languages[currentLang].azkarTypes[typeKey]) {
        el.textContent = languages[currentLang].azkarTypes[typeKey];
      }
      
      // Clear any previous dynamic font size classes
      el.classList.remove('text-xs', 'text-sm'); 

      if (currentLang === 'en') {
        el.classList.add('text-xs'); // Smaller font for English labels
      } else { // Arabic
        el.classList.add('text-sm'); // Slightly larger font for Arabic labels
      }
    }
  });
}
// Patch switchLanguage to also update azkar labels
const origSwitchLanguage = window.switchLanguage;
window.switchLanguage = function() {
  origSwitchLanguage();
  updateAzkarTypeLabels();
};
      

     
(function() {
  let popover = document.getElementById('ayahMenuPopover');
  let lastAyahElem = null;
  let popoverAyah = null;
  let popoverSurah = null;

  // Helper to close the popover
  function closePopover() {
    popover.style.display = 'none';
    lastAyahElem = null;
    popoverAyah = null;
    popoverSurah = null;
    
    // Clear any active tooltips
    clearAyahMenuTooltips();
  }
  
  // Function to show sequential tooltips for ayah menu buttons
  function showAyahMenuTooltips() {
    const langIsAr = currentLang === 'ar';
    const isMobile = window.innerWidth <= 768;
    const buttons = [
      {
        id: 'ayahMenuPlay',
        tooltip: window.currentAyahAudio && currentAudioSurah === popoverSurah && currentAudioAyah === popoverAyah && !window.currentAyahAudio.paused 
          ? (langIsAr ? 'ايقاف الاية' : 'Stop Ayah')
          : (langIsAr ? 'تشغيل الآية' : 'Play Ayah'),
        delay: isMobile ? 800 : 500
      },
      {
        id: 'ayahMenuTranslation',
        tooltip: langIsAr ? 'إظهار الترجمة' : 'Show Translation',
        delay: isMobile ? 2800 : 2000
      },
      {
        id: 'ayahMenuTafsir',
        tooltip: isTafsirVisible 
          ? (langIsAr ? 'إخفاء التفسير' : 'Hide Tafsir') 
          : (langIsAr ? 'إظهار التفسير' : 'Show Tafsir'),
        delay: isMobile ? 5100 : 3500
      },
      {
        id: 'ayahMenuBookmark',
        tooltip: currentBookmark && currentBookmark.surah === popoverSurah && currentBookmark.ayah === popoverAyah
          ? (langIsAr ? 'إزالة العلامة' : 'Remove Bookmark')
          : (langIsAr ? 'إشارة مرجعية' : 'Bookmark'),
        delay: isMobile ? 7400 : 5000
      },
      {
        id: 'ayahMenuShare',
        tooltip: langIsAr ? 'مشاركة الآية' : 'Share Verse',
        delay: isMobile ? 9700 : 6500
      }
    ];
    
    // Clear any existing tooltips first
    clearAyahMenuTooltips();
    
    buttons.forEach(button => {
      setTimeout(() => {
        const btn = document.getElementById(button.id);
        const popover = document.getElementById('ayahMenuPopover');
        if (btn && popover && popover.style.display !== 'none') {
          // Clear any other active tooltips before showing this one
          clearAyahMenuTooltips();
          
          btn.setAttribute('data-tooltip', button.tooltip);
          btn.classList.add('show-tooltip');
          
          // Auto-hide tooltip after longer duration on mobile
          const tooltipDuration = isMobile ? 2000 : 1500;
          setTimeout(() => {
            if (btn.classList.contains('show-tooltip')) {
              btn.classList.remove('show-tooltip');
            }
          }, tooltipDuration);
        }
      }, button.delay);
    });
  }
  
  // Function to clear all ayah menu tooltips
  function clearAyahMenuTooltips() {
    const buttons = ['ayahMenuPlay', 'ayahMenuTranslation', 'ayahMenuTafsir', 'ayahMenuBookmark', 'ayahMenuShare'];
    buttons.forEach(buttonId => {
      const btn = document.getElementById(buttonId);
      if (btn) {
        btn.classList.remove('show-tooltip');
      }
    });
  }

  // Attach popover to ayah click
  document.addEventListener('click', function(e) {
    // If click is on an ayah
    if (e.target.classList.contains('ayah')) {
      e.preventDefault();
      e.stopPropagation();
      lastAyahElem = e.target;
      popoverAyah = parseInt(e.target.getAttribute('data-ayah'));
      popoverSurah = parseInt(e.target.getAttribute('data-surah'));
      // Position popover with smart viewport-aware positioning
      const rect = e.target.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // Show popover first to get its dimensions
      popover.style.display = 'block';
      popover.style.visibility = 'hidden'; // Hide while positioning
      
      const popoverRect = popover.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate initial position (centered above the ayah)
      let top = rect.top + scrollY - popoverRect.height - 8;
      let left = rect.left + scrollX + rect.width/2 - popoverRect.width/2;
      
      // Adjust horizontal position to stay within viewport
      const minLeft = 8; // 8px margin from left edge
      const maxLeft = viewportWidth - popoverRect.width - 8; // 8px margin from right edge
      left = Math.max(minLeft, Math.min(left, maxLeft));
      
      // Adjust vertical position for mobile and small screens
      const isMobile = viewportWidth <= 768;
      if (isMobile) {
        // On mobile, if there's not enough space above, position below
        if (top < 60) { // 60px from top to avoid header
          top = rect.bottom + scrollY + 8;
        }
        
        // Ensure popover doesn't go off bottom of screen
        if (top + popoverRect.height > scrollY + viewportHeight - 20) {
          top = scrollY + viewportHeight - popoverRect.height - 20;
        }
        
        // For very short verses on mobile, center the popover more
        if (rect.width < 50) {
          left = viewportWidth/2 - popoverRect.width/2;
        }
      } else {
        // Desktop: ensure popover stays within viewport vertically
        if (top < scrollY + 8) {
          top = rect.bottom + scrollY + 8; // Position below if not enough space above
        }
      }
      
      popover.style.top = top + 'px';
      popover.style.left = left + 'px';
      popover.style.visibility = 'visible';
      // Set direction and alignment based on language
      if (currentLang === 'en') {
        popover.style.direction = 'ltr';
        popover.style.textAlign = 'left';
        } else {
        popover.style.direction = 'rtl';
        popover.style.textAlign = 'right';
      }
      // Update menu text/icons based on current state
      const langIsAr = currentLang === 'ar';
      // Update tooltips based on current state and language
      document.getElementById('ayahMenuTranslation').title = isTranslationVisible ? (langIsAr ? 'إخفاء الترجمة' : 'Hide Translation') : (langIsAr ? 'إظهار الترجمة' : 'Show Translation');
      document.getElementById('ayahMenuTafsir').title = isTafsirVisible ? (langIsAr ? 'إخفاء التفسير' : 'Hide Tafsir') : (langIsAr ? 'إظهار التفسير' : 'Show Tafsir');
      // Bookmark icon and tooltip
      const isBookmarked = currentBookmark && currentBookmark.surah === popoverSurah && currentBookmark.ayah === popoverAyah;
      document.getElementById('ayahMenuBookmark').querySelector('i').className = isBookmarked ? 'fas fa-bookmark text-yellow-500' : 'far fa-bookmark';
      document.getElementById('ayahMenuBookmark').title = isBookmarked ? (langIsAr ? 'إزالة العلامة' : 'Remove Bookmark') : (langIsAr ? 'إشارة مرجعية' : 'Bookmark');
      // Play/Stop icon and tooltip
      const isPlaying = window.currentAyahAudio && currentAudioSurah === popoverSurah && currentAudioAyah === popoverAyah && !window.currentAyahAudio.paused;
      const playBtn = document.getElementById('ayahMenuPlay');
      playBtn.querySelector('i').className = isPlaying ? 'fas fa-stop' : 'fas fa-play';
      playBtn.title = isPlaying ? (langIsAr ? 'ايقاف الاية' : 'Stop Ayah') : (langIsAr ? 'تشغيل الآية' : 'Play Ayah');
      
      // Show sequential tooltips for menu buttons
      showAyahMenuTooltips();
    } else if (!popover.contains(e.target)) {
      closePopover();
      }
    });
  // Hide popover on scroll
  window.addEventListener('scroll', closePopover);
  // Menu actions
  document.getElementById('ayahMenuPlay').onclick = function() {
    if (popoverSurah !== null && popoverAyah !== null) playAyahAudio(popoverSurah, popoverAyah);
    closePopover();
  };
  document.getElementById('ayahMenuTranslation').onclick = function() {
    if (popoverSurah !== null && popoverAyah !== null) {
      showTranslationModal(popoverSurah, popoverAyah);
    }
    closePopover();
  };
  document.getElementById('ayahMenuTafsir').onclick = function() {
    if (popoverSurah !== null && popoverAyah !== null) {
      showTafsirModal(popoverSurah, popoverAyah);
    }
    closePopover();
  };
  document.getElementById('ayahMenuBookmark').onclick = function() {
    if (popoverSurah !== null && popoverAyah !== null) bookmarkAyah(popoverSurah, popoverAyah);
    closePopover();
  };
  document.getElementById('ayahMenuShare').onclick = function() {
    if (popoverSurah !== null && popoverAyah !== null) {
      const shareURL = `${window.location.origin}${window.location.pathname}#quran/${popoverSurah + 1}/${popoverAyah + 1}`;
      const surahName = quranData[popoverSurah].name;
      shareVerse(shareURL, surahName, popoverAyah + 1);
    }
    closePopover();
  };
})();

// Add tafsir modal functions
let currentTafsirSurah = null;
let currentTafsirAyah = null;

function showTafsirModal(surah, ayah) {
  const modal = document.getElementById('tafsirModal');
  const surahData = quranData[surah];
  const translationAyahs = translationData[surah];
  const ayahData = surahData.ayahs[ayah];
  const translationAyah = translationAyahs.ayahs[ayah];
  
  // Store current ayah for language change
  currentTafsirSurah = surah;
  currentTafsirAyah = ayah;
  
  // Set modal content
  document.getElementById('tafsirModalTitle').textContent = currentLang === 'ar' ? 'التفسير' : 'Tafsir';
  
  // Set text direction for ayah and translation
  const tafsirModalAyah = document.getElementById('tafsirModalAyah');
  const tafsirModalTranslation = document.getElementById('tafsirModalTranslation');
  const tafsirModalContent = document.getElementById('tafsirModalContent');
  
  // Arabic ayah is always RTL
  tafsirModalAyah.dir = 'rtl';
  tafsirModalAyah.textContent = ayahData.text;
  
  // Translation is LTR
  tafsirModalTranslation.dir = 'ltr';
  tafsirModalTranslation.textContent = translationAyah ? translationAyah.text : '';
  
  // Tafsir content direction based on selected source
  const tafsirSelect = document.getElementById('tafsirSelect');
  const isEnglishTafsir = tafsirSelect.value.startsWith('en-');
  tafsirModalContent.dir = isEnglishTafsir ? 'ltr' : 'rtl';
  tafsirModalContent.textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
  
  // Show modal
  modal.style.display = 'flex';
  
  // Load tafsir
  loadTafsirContent();
}

function loadTafsirContent() {
  if (currentTafsirSurah !== null && currentTafsirAyah !== null) {
    getTafsirForAyah(currentTafsirSurah, currentTafsirAyah).then(tafsir => {
      const tafsirModalContent = document.getElementById('tafsirModalContent');
      const tafsirSelect = document.getElementById('tafsirSelect');
      const isEnglishTafsir = tafsirSelect.value.startsWith('en-');
      
      // Set direction based on tafsir source
      tafsirModalContent.dir = isEnglishTafsir ? 'ltr' : 'rtl';
      tafsirModalContent.textContent = tafsir.text || (currentLang === 'ar' ? 'لا يوجد تفسير متاح' : 'Tafsir not available');
    });
  }
}

function closeTafsirModal() {
  document.getElementById('tafsirModal').style.display = 'none';
  currentTafsirSurah = null;
  currentTafsirAyah = null;
}



// Add translation modal functions
let currentTranslationSurah = null;
let currentTranslationAyah = null;

function showTranslationModal(surah, ayah) {
  const modal = document.getElementById('translationModal');
  const surahData = quranData[surah];
  const ayahData = surahData.ayahs[ayah];
  
  // Store current ayah for translation change
  currentTranslationSurah = surah;
  currentTranslationAyah = ayah;
  
  // Set modal content
  document.getElementById('translationModalTitle').textContent = currentLang === 'ar' ? 'الترجمة' : 'Translation';
  
  // Set text direction for ayah and translation
  const translationModalAyah = document.getElementById('translationModalAyah');
  const translationModalContent = document.getElementById('translationModalContent');
  
  // Arabic ayah is always RTL
  translationModalAyah.dir = 'rtl';
  translationModalAyah.textContent = ayahData.text;
  
  // Translation content is always LTR since we only have English translations
  translationModalContent.dir = 'ltr';
  translationModalContent.textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
  
  // Show modal
  modal.style.display = 'flex';
  
  // Load translation
  loadTranslationContent();
}

function loadTranslationContent() {
  if (currentTranslationSurah !== null && currentTranslationAyah !== null) {
    const translationAyahs = translationData[currentTranslationSurah];
    const translationAyah = translationAyahs.ayahs[currentTranslationAyah];
    const translationModalContent = document.getElementById('translationModalContent');
    
    // Translation is always LTR
    translationModalContent.dir = 'ltr';
    translationModalContent.textContent = translationAyah ? translationAyah.text : (currentLang === 'ar' ? 'لا توجد ترجمة متاحة' : 'No translation available');
  }
}

function closeTranslationModal() {
  document.getElementById('translationModal').style.display = 'none';
  currentTranslationSurah = null;
  currentTranslationAyah = null;
}





// Create an alias for backward compatibility
async function displayReadingModeAyahs(shouldScrollToBookmark = false, scrollToVerseId = null) {
  return displayReadingModeAyahsByPages(shouldScrollToBookmark, scrollToVerseId);
}

// Voice Search Functionality
let recognition = null;
let isListening = false;

// Comprehensive iOS Safari voice text normalization
function normalizeiOSVoiceText(text) {
 
  let normalized = text
    // AGGRESSIVE invisible character removal - iOS Safari adds these at the beginning
    .replace(/^[\u0000-\u001F\u007F-\u009F\u00AD\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2800\u3000\uFEFF\uFFF9-\uFFFB]+/, '') // Remove leading control chars
    .replace(/[\u0000-\u001F\u007F-\u009F\u00AD\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2800\u3000\uFEFF\uFFF9-\uFFFB]/g, '') // Remove all control chars
    // Remove specific iOS Safari artifacts
    .replace(/^[\u200E\u200F\u202A\u202B\u202C\u202D\u202E]+/, '') // Remove leading RTL/LTR marks
    .replace(/[\u200E\u200F\u202A\u202B\u202C\u202D\u202E]/g, '') // Remove all RTL/LTR marks
    // Remove zero-width characters that iOS Safari loves to add
    .replace(/^[\u200B\u200C\u200D\uFEFF]+/, '') // Remove leading zero-width chars
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '') // Remove all zero-width chars
    // Remove non-breaking spaces and other space variants
    .replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, ' ')
    // Normalize Unicode to NFD (decomposed) then to NFC (composed)
    .normalize('NFD').normalize('NFC')
    // Handle iOS Safari specific Arabic character issues
    .replace(/[\u064B-\u0652\u0670\u0640\u06D6-\u06ED\u08F0-\u08FF]/g, '') // Remove diacritics
    // Normalize specific problematic characters iOS Safari might produce
    .replace(/\u0627\u0644/g, 'ال') // Ensure proper "al" (alef + lam)
    .replace(/\u0641\u0627\u062A\u062D/g, 'فاتح') // Specific fix for "فاتح"
    .replace(/\u0641\u0627\u062A\u062D\u0629/g, 'فاتحة') // Specific fix for "فاتحة"
    // Normalize alef variants
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627') // أ إ آ ٱ -> ا
    // Normalize other common variations
    .replace(/\u0629/g, '\u0647') // ة -> ه
    // Final cleanup - remove any remaining control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Trim whitespace
    .trim();
  

  return normalized;
}

// Enhanced voice search function for iOS Safari compatibility
function performEnhancedVoiceSearch(transcript) {

  // Clean up the transcript for iOS Safari issues
  let cleanedTranscript = transcript
    // Remove any invisible characters that iOS Safari might add
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove any extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  // Apply comprehensive iOS Safari character normalization
  const normalizedTranscript = normalizeiOSVoiceText(cleanedTranscript);
  
  // Try the regular search first with normalized text
  searchSurahs(normalizedTranscript);
  
  // Check if we got results
  setTimeout(() => {
    const surahList = document.getElementById('surahList');
    const hasResults = surahList.children.length > 0 && 
                      !surahList.innerHTML.includes('لم يتم العثور') && 
                      !surahList.innerHTML.includes('No results');
    
    
    if (!hasResults) {
      
      // Try enhanced matching for Arabic text
      const searchData = surahsData.length > 0 ? surahsData : quickSurahList;
      const enhancedResults = searchData.filter(surah => {
        const arabicName = surah.name || '';
        const englishName = surah.englishName || '';
        
                 // Create multiple search variants using normalized transcript
         const searchVariants = [
           normalizedTranscript,
           normalizeArabicText(normalizedTranscript),
           normalizedTranscript.replace(/^ال/, ''), // Remove "al" prefix
           'ال' + normalizedTranscript, // Add "al" prefix
           normalizedTranscript.replace(/[أإآٱ]/g, 'ا'), // Normalize Alef
           normalizedTranscript.replace(/ة/g, 'ه'), // Normalize Teh Marbuta
           // Enhanced hamza normalization for voice recognition
           normalizedTranscript.replace(/اخ/g, 'إخ'), // اخ -> إخ (for الاخلاص -> الإخلاص)
           normalizedTranscript.replace(/ا([خحجهعغفقثصضذدزرتبيسشظطكلمنوؤئء])/g, 'إ$1'), // Add hamza before consonants
           normalizedTranscript.replace(/ء/g, ''), // Remove standalone hamza
           normalizedTranscript.replace(/[ءؤئ]/g, ''), // Remove all hamza variants
           // Also include the original cleaned transcript as fallback
           cleanedTranscript,
           normalizeArabicText(cleanedTranscript),
         ];
        
        // Check each variant against surah names
        return searchVariants.some(variant => {
          if (!variant || variant.length === 0) return false;
          
                     // Flexible matching - check if variant is contained in surah name or vice versa
           const normalizedArabic = normalizeArabicText(arabicName);
           const normalizedVariant = normalizeArabicText(variant);
           
           // Additional hamza-agnostic normalization for both search and surah name
           const hamzaFreeArabic = normalizedArabic.replace(/[ءؤئإأآ]/g, 'ا');
           const hamzaFreeVariant = normalizedVariant.replace(/[ءؤئإأآ]/g, 'ا');
           
           return (
             arabicName.includes(variant) ||
             normalizedArabic.includes(normalizedVariant) ||
             variant.includes(arabicName) ||
             normalizedVariant.includes(normalizedArabic) ||
             englishName.toLowerCase().includes(variant.toLowerCase()) ||
             variant.toLowerCase().includes(englishName.toLowerCase()) ||
             // Hamza-agnostic matching (key for voice recognition)
             hamzaFreeArabic.includes(hamzaFreeVariant) ||
             hamzaFreeVariant.includes(hamzaFreeArabic) ||
             // Partial matching for better voice recognition results
             (normalizedVariant.length >= 3 && normalizedArabic.includes(normalizedVariant)) ||
             (normalizedArabic.length >= 3 && normalizedVariant.includes(normalizedArabic)) ||
             // Hamza-free partial matching
             (hamzaFreeVariant.length >= 3 && hamzaFreeArabic.includes(hamzaFreeVariant)) ||
             (hamzaFreeArabic.length >= 3 && hamzaFreeVariant.includes(hamzaFreeArabic))
           );
        });
      });
      
      
             if (enhancedResults.length > 0) {
         populateSurahList(enhancedResults);
       } else {
         // LAST RESORT: Try progressively removing characters from the beginning
         let foundMatch = false;
         
         for (let i = 1; i <= Math.min(5, normalizedTranscript.length); i++) {
           const strippedText = normalizedTranscript.substring(i);
           
           if (strippedText.length >= 2) { // Only try if we have at least 2 characters left
             const progressiveResults = searchData.filter(surah => {
               const arabicName = surah.name || '';
               const normalizedArabic = normalizeArabicText(arabicName);
               const normalizedStripped = normalizeArabicText(strippedText);
               
               return (
                 arabicName.includes(strippedText) ||
                 normalizedArabic.includes(normalizedStripped) ||
                 strippedText.includes(arabicName) ||
                 normalizedStripped.includes(normalizedArabic)
               );
             });
             
             if (progressiveResults.length > 0) {
               populateSurahList(progressiveResults);
               foundMatch = true;
               break;
             }
           }
         }
         
         if (!foundMatch) {
           // Absolute last resort: show all surahs with a message
           const surahList = document.getElementById('surahList');
           populateSurahList(searchData);
           
           // Add a message at the top
           const messageDiv = document.createElement('div');
           messageDiv.className = 'p-3 mb-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-center';
           messageDiv.innerHTML = `
             <p class="text-sm text-yellow-700 dark:text-yellow-300">
               ${currentLang === 'ar' ? 
                 `لم يتم العثور على "${normalizedTranscript}" - عرض جميع السور` : 
                 `"${normalizedTranscript}" not found - showing all surahs`
               }
             </p>
           `;
           surahList.insertBefore(messageDiv, surahList.firstChild);
         }
       }
    }
  }, 50);
}

// Function to find the best Surah match from voice alternatives
function findBestSurahMatch(alternatives) {
  if (!alternatives || alternatives.length === 0) return null;
  
  // Get all Surah names in both Arabic and English
  const surahNames = [];
  
  // Add from surahsData if available
  if (surahsData && surahsData.length > 0) {
    surahsData.forEach(surah => {
      if (surah.name) surahNames.push(surah.name);
      if (surah.englishName) surahNames.push(surah.englishName);
      if (surah.englishNameTranslation) surahNames.push(surah.englishNameTranslation);
    });
  }
  
  // Add from quickSurahList if available
  if (quickSurahList && quickSurahList.length > 0) {
    quickSurahList.forEach(surah => {
      if (surah.name) surahNames.push(surah.name);
      if (surah.englishName) surahNames.push(surah.englishName);
      if (surah.englishNameTranslation) surahNames.push(surah.englishNameTranslation);
    });
  }
  
  // Common Surah names as fallback
  const commonSurahNames = [
    'الفاتحة', 'Al-Fatiha', 'Fatiha', 'The Opening',
    'البقرة', 'Al-Baqarah', 'Baqarah', 'The Cow',
    'آل عمران', 'Al-Imran', 'Imran', 'Family of Imran',
    'النساء', 'An-Nisa', 'Nisa', 'The Women',
    'المائدة', 'Al-Maidah', 'Maidah', 'The Table Spread',
    'الأنعام', 'Al-Anam', 'Anam', 'The Cattle',
    'الأعراف', 'Al-Araf', 'Araf', 'The Heights',
    'الأنفال', 'Al-Anfal', 'Anfal', 'The Spoils of War',
    'التوبة', 'At-Tawbah', 'Tawbah', 'The Repentance',
    'يونس', 'Yunus', 'Jonah',
    'هود', 'Hud',
    'يوسف', 'Yusuf', 'Joseph',
    'الرعد', 'Ar-Rad', 'Rad', 'The Thunder',
    'إبراهيم', 'Ibrahim', 'Abraham',
    'الحجر', 'Al-Hijr', 'Hijr', 'The Rocky Tract',
    'النحل', 'An-Nahl', 'Nahl', 'The Bee',
    'الإسراء', 'Al-Isra', 'Isra', 'The Night Journey',
    'الكهف', 'Al-Kahf', 'Kahf', 'The Cave',
    'مريم', 'Maryam', 'Mary',
    'طه', 'Ta-Ha', 'Taha',
    'الأنبياء', 'Al-Anbiya', 'Anbiya', 'The Prophets',
    'الحج', 'Al-Hajj', 'Hajj', 'The Pilgrimage',
    'المؤمنون', 'Al-Muminun', 'Muminun', 'The Believers',
    'النور', 'An-Nur', 'Nur', 'The Light',
    'الفرقان', 'Al-Furqan', 'Furqan', 'The Criterion',
    'الشعراء', 'Ash-Shuara', 'Shuara', 'The Poets',
    'النمل', 'An-Naml', 'Naml', 'The Ant',
    'القصص', 'Al-Qasas', 'Qasas', 'The Stories',
    'العنكبوت', 'Al-Ankabut', 'Ankabut', 'The Spider',
    'الروم', 'Ar-Rum', 'Rum', 'The Romans',
    'لقمان', 'Luqman',
    'السجدة', 'As-Sajdah', 'Sajdah', 'The Prostration',
    'الأحزاب', 'Al-Ahzab', 'Ahzab', 'The Clans',
    'سبأ', 'Saba', 'Sheba',
    'فاطر', 'Fatir', 'Originator',
    'يس', 'Ya-Sin', 'Yasin',
    'الصافات', 'As-Saffat', 'Saffat', 'Those Ranged in Ranks',
    'ص', 'Sad',
    'الزمر', 'Az-Zumar', 'Zumar', 'The Groups',
    'غافر', 'Ghafir', 'The Forgiver',
    'فصلت', 'Fussilat', 'Explained in Detail',
    'الشورى', 'Ash-Shura', 'Shura', 'The Consultation',
    'الزخرف', 'Az-Zukhruf', 'Zukhruf', 'The Gold Adornments',
    'الدخان', 'Ad-Dukhan', 'Dukhan', 'The Smoke',
    'الجاثية', 'Al-Jathiyah', 'Jathiyah', 'The Kneeling',
    'الأحقاف', 'Al-Ahqaf', 'Ahqaf', 'The Wind-Curved Sandhills',
    'محمد', 'Muhammad',
    'الفتح', 'Al-Fath', 'Fath', 'The Victory',
    'الحجرات', 'Al-Hujurat', 'Hujurat', 'The Rooms',
    'ق', 'Qaf',
    'الذاريات', 'Adh-Dhariyat', 'Dhariyat', 'The Wind That Scatter',
    'الطور', 'At-Tur', 'Tur', 'The Mount',
    'النجم', 'An-Najm', 'Najm', 'The Star',
    'القمر', 'Al-Qamar', 'Qamar', 'The Moon',
    'الرحمن', 'Ar-Rahman', 'Rahman', 'The Most Merciful',
    'الواقعة', 'Al-Waqiah', 'Waqiah', 'The Event',
    'الحديد', 'Al-Hadid', 'Hadid', 'The Iron',
    'المجادلة', 'Al-Mujadilah', 'Mujadilah', 'The Pleading Woman',
    'الحشر', 'Al-Hashr', 'Hashr', 'The Exile',
    'الممتحنة', 'Al-Mumtahanah', 'Mumtahanah', 'She That Is To Be Examined',
    'الصف', 'As-Saff', 'Saff', 'The Ranks',
    'الجمعة', 'Al-Jumuah', 'Jumuah', 'The Friday',
    'المنافقون', 'Al-Munafiqun', 'Munafiqun', 'The Hypocrites',
    'التغابن', 'At-Taghabun', 'Taghabun', 'The Mutual Disillusion',
    'الطلاق', 'At-Talaq', 'Talaq', 'The Divorce',
    'التحريم', 'At-Tahrim', 'Tahrim', 'The Prohibition',
    'الملك', 'Al-Mulk', 'Mulk', 'The Sovereignty',
    'القلم', 'Al-Qalam', 'Qalam', 'The Pen',
    'الحاقة', 'Al-Haqqah', 'Haqqah', 'The Reality',
    'المعارج', 'Al-Maarij', 'Maarij', 'The Ascending Stairways',
    'نوح', 'Nuh', 'Noah',
    'الجن', 'Al-Jinn', 'Jinn', 'The Jinn',
    'المزمل', 'Al-Muzzammil', 'Muzzammil', 'The Enshrouded One',
    'المدثر', 'Al-Muddaththir', 'Muddaththir', 'The Cloaked One',
    'القيامة', 'Al-Qiyamah', 'Qiyamah', 'The Resurrection',
    'الإنسان', 'Al-Insan', 'Insan', 'The Man',
    'المرسلات', 'Al-Mursalat', 'Mursalat', 'The Emissaries',
    'النبأ', 'An-Naba', 'Naba', 'The Tidings',
    'النازعات', 'An-Naziat', 'Naziat', 'Those Who Drag Forth',
    'عبس', 'Abasa', 'He Frowned',
    'التكوير', 'At-Takwir', 'Takwir', 'The Overthrowing',
    'الانفطار', 'Al-Infitar', 'Infitar', 'The Cleaving',
    'المطففين', 'Al-Mutaffifin', 'Mutaffifin', 'The Defrauding',
    'الانشقاق', 'Al-Inshiqaq', 'Inshiqaq', 'The Splitting Open',
    'البروج', 'Al-Buruj', 'Buruj', 'The Mansions of the Stars',
    'الطارق', 'At-Tariq', 'Tariq', 'The Morning Star',
    'الأعلى', 'Al-Ala', 'Ala', 'The Most High',
    'الغاشية', 'Al-Ghashiyah', 'Ghashiyah', 'The Overwhelming',
    'الفجر', 'Al-Fajr', 'Fajr', 'The Dawn',
    'البلد', 'Al-Balad', 'Balad', 'The City',
    'الشمس', 'Ash-Shams', 'Shams', 'The Sun',
    'الليل', 'Al-Layl', 'Layl', 'The Night',
    'الضحى', 'Ad-Duha', 'Duha', 'The Morning Hours',
    'الشرح', 'Ash-Sharh', 'Sharh', 'The Relief',
    'التين', 'At-Tin', 'Tin', 'The Fig',
    'العلق', 'Al-Alaq', 'Alaq', 'The Clot',
    'القدر', 'Al-Qadr', 'Qadr', 'The Power',
    'البينة', 'Al-Bayyinah', 'Bayyinah', 'The Clear Proof',
    'الزلزلة', 'Az-Zalzalah', 'Zalzalah', 'The Earthquake',
    'العاديات', 'Al-Adiyat', 'Adiyat', 'The Courser',
    'القارعة', 'Al-Qariah', 'Qariah', 'The Calamity',
    'التكاثر', 'At-Takathur', 'Takathur', 'The Rivalry in World Increase',
    'العصر', 'Al-Asr', 'Asr', 'The Declining Day',
    'الهمزة', 'Al-Humazah', 'Humazah', 'The Traducer',
    'الفيل', 'Al-Fil', 'Fil', 'The Elephant',
    'قريش', 'Quraysh',
    'الماعون', 'Al-Maun', 'Maun', 'The Small Kindnesses',
    'الكوثر', 'Al-Kawthar', 'Kawthar', 'The Abundance',
    'الكافرون', 'Al-Kafirun', 'Kafirun', 'The Disbelievers',
    'النصر', 'An-Nasr', 'Nasr', 'The Divine Support',
    'المسد', 'Al-Masad', 'Masad', 'The Palm Fiber',
    'الإخلاص', 'Al-Ikhlas', 'Ikhlas', 'The Sincerity',
    'الفلق', 'Al-Falaq', 'Falaq', 'The Daybreak',
    'الناس', 'An-Nas', 'Nas', 'The Mankind'
  ];
  
  // Combine all available names
  const allNames = [...new Set([...surahNames, ...commonSurahNames])];
  
  
  let bestMatch = null;
  let bestScore = 0;
  
  // Check each alternative against all Surah names
  for (const alternative of alternatives) {
    for (const surahName of allNames) {
      const score = calculateSimilarity(alternative.toLowerCase(), surahName.toLowerCase());
      if (score > bestScore && score > 0.3) { // Minimum similarity threshold
        bestScore = score;
        bestMatch = alternative;
      }
    }
  }
  
  return bestMatch;
}

// Enhanced similarity calculation with phonetic matching
function calculateSimilarity(str1, str2) {
  // Normalize Arabic text
  str1 = str1.replace(/[أإآ]/g, 'ا').replace(/[ىي]/g, 'ي').replace(/ة/g, 'ه');
  str2 = str2.replace(/[أإآ]/g, 'ا').replace(/[ىي]/g, 'ي').replace(/ة/g, 'ه');
  
  // Check for exact match or substring
  if (str1 === str2) return 1.0;
  if (str1.includes(str2) || str2.includes(str1)) return 0.8;
  
  // Phonetic similarity for common voice recognition errors
  const phoneticScore = calculatePhoneticSimilarity(str1, str2);
  if (phoneticScore > 0.6) return phoneticScore;
  
  // Calculate Levenshtein distance
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  return (maxLength - distance) / maxLength;
}

// Calculate phonetic similarity for common voice recognition errors
function calculatePhoneticSimilarity(voiceInput, surahName) {
  // Common phonetic mappings for Arabic names misheard as English
  const phoneticMappings = {
         // Al-Fatiha variants
     'a lot': ['al-faatiha', 'al fatiha', 'alfatiha', 'fatiha'],
     'alot': ['al-faatiha', 'al fatiha', 'alfatiha', 'fatiha'],
     'a lot of': ['al-faatiha', 'al fatiha', 'fatiha'],
     'allah': ['al-faatiha', 'al fatiha', 'fatiha'],
     'al fatiha': ['al-faatiha', 'fatiha'],
     'alfatiha': ['al-faatiha', 'fatiha'],
     'fatiha': ['al-faatiha', 'fatiha'],
    
         // Al-Baqarah variants
     'back': ['al-baqara', 'baqara', 'bakara'],
     'back are': ['al-baqara', 'baqara'],
     'baker': ['al-baqara', 'baqara', 'bakara'],
     'backer': ['al-baqara', 'baqara'],
     'baqara': ['al-baqara', 'baqara'],
     'bakara': ['al-baqara', 'baqara'],
    
    // Al-Imran variants
    'all run': ['al-imran', 'imran'],
    'all ran': ['al-imran', 'imran'],
    'elmer': ['al-imran', 'imran'],
    'alimran': ['al-imran', 'imran'],
    
    // An-Nisa variants
    'and lisa': ['an-nisa', 'nisa'],
    'anissa': ['an-nisa', 'nisa'],
    'a lisa': ['an-nisa', 'nisa'],
    
    // Al-Maidah variants
    'my dad': ['al-maidah', 'maidah'],
    'my data': ['al-maidah', 'maidah'],
    'almighty': ['al-maidah', 'maidah'],
    
    // Al-Anam variants
    'and am': ['al-anam', 'anam'],
    'annam': ['al-anam', 'anam'],
    'and i am': ['al-anam', 'anam'],
    
    // Al-Araf variants
    'all rough': ['al-araf', 'araf'],
    'allraf': ['al-araf', 'araf'],
    'a rough': ['al-araf', 'araf'],
    
    // Al-Anfal variants
    'and fall': ['al-anfal', 'anfal'],
    'and fell': ['al-anfal', 'anfal'],
    'awful': ['al-anfal', 'anfal'],
    
    // At-Tawbah variants
    'at toba': ['at-tawbah', 'tawbah'],
    'at tuba': ['at-tawbah', 'tawbah'],
    'a tuba': ['at-tawbah', 'tawbah'],
    
    // Yunus variants
    'you miss': ['yunus', 'jonas'],
    'you ness': ['yunus', 'jonas'],
    'jonas': ['yunus', 'jonas'],
    
    // Yusuf variants
    'you surf': ['yusuf', 'joseph'],
    'joseph': ['yusuf', 'joseph'],
    'you suf': ['yusuf', 'joseph'],
    
    // Ibrahim variants
    'abraham': ['ibrahim'],
    'abe': ['ibrahim'],
    'ibrahim': ['ibrahim'],
    
    // Al-Kahf variants
    'all calf': ['al-kahf', 'kahf'],
    'all half': ['al-kahf', 'kahf'],
    'al calf': ['al-kahf', 'kahf'],
    
    // Maryam variants
    'mary': ['maryam'],
    'maria': ['maryam'],
    'marry': ['maryam'],
    
    // Ta-Ha variants
    'ta ha': ['ta-ha', 'taha'],
    'taha': ['ta-ha', 'taha'],
    'ta-ha': ['ta-ha', 'taha'],
    
    // Ya-Sin variants
    'ya sin': ['ya-sin', 'yasin'],
    'yasin': ['ya-sin', 'yasin'],
    'ya seen': ['ya-sin', 'yasin'],
    'yes in': ['ya-sin', 'yasin'],
    
         // Muhammad variants
     'muhammad': ['muhammad'],
     'mohamed': ['muhammad'],
     'mohammed': ['muhammad'],
     
     // Az-Zumar variants
     'azumar': ['az-zumar', 'zumar'],
     'azuma': ['az-zumar', 'zumar'],
     'ozumo': ['az-zumar', 'zumar'],
     'azumah': ['az-zumar', 'zumar'],
     'izumo': ['az-zumar', 'zumar'],
     'zumar': ['az-zumar', 'zumar'],
    
    // Ar-Rahman variants
    'our man': ['ar-rahman', 'rahman'],
    'rahman': ['ar-rahman', 'rahman'],
    'our rahman': ['ar-rahman', 'rahman'],
    
    // Al-Ikhlas variants
    'all class': ['al-ikhlas', 'ikhlas'],
    'all close': ['al-ikhlas', 'ikhlas'],
    'a class': ['al-ikhlas', 'ikhlas'],
    
         // An-Nas variants
     'and us': ['an-nas', 'nas'],
     'and nas': ['an-nas', 'nas'],
     'a nas': ['an-nas', 'nas'],
     'anas': ['an-nas', 'nas'],
     'nas': ['an-nas', 'nas'],
     'agnes': ['an-nas', 'nas'],
     'agnus': ['an-nas', 'nas'],
     'honest': ['an-nas', 'nas'],
    
         // Al-Falaq variants
     'all flack': ['al-falaq', 'falaq'],
     'all flag': ['al-falaq', 'falaq'],
     'a flag': ['al-falaq', 'falaq'],
     'falak': ['al-falaq', 'falaq'],
     'flak': ['al-falaq', 'falaq'],
     
     // Additional common misheard variants
     'cow': ['al-baqarah', 'baqarah'],
     'the cow': ['al-baqarah', 'baqarah'],
     'women': ['an-nisa', 'nisa'],
     'the women': ['an-nisa', 'nisa'],
     'cave': ['al-kahf', 'kahf'],
     'the cave': ['al-kahf', 'kahf'],
     'light': ['an-nur', 'nur'],
     'the light': ['an-nur', 'nur'],
     'iron': ['al-hadid', 'hadid'],
     'the iron': ['al-hadid', 'hadid'],
     'moon': ['al-qamar', 'qamar'],
     'the moon': ['al-qamar', 'qamar'],
     'sun': ['ash-shams', 'shams'],
     'the sun': ['ash-shams', 'shams'],
     'night': ['al-layl', 'layl'],
     'the night': ['al-layl', 'layl'],
     'dawn': ['al-fajr', 'fajr'],
     'the dawn': ['al-fajr', 'fajr'],
     'elephant': ['al-fil', 'fil'],
     'the elephant': ['al-fil', 'fil'],
     'opening': ['al-fatiha', 'fatiha'],
     'the opening': ['al-fatiha', 'fatiha']
  };
  
  const voiceLower = voiceInput.toLowerCase().trim();
  const surahLower = surahName.toLowerCase().trim();
  
  // Check if voice input matches any phonetic mapping
  if (phoneticMappings[voiceLower]) {
    for (const variant of phoneticMappings[voiceLower]) {
      if (surahLower.includes(variant) || variant.includes(surahLower)) {
        return 0.9; // High confidence for phonetic matches
      }
    }
  }
  
  // Check reverse mapping (if surah name is in the phonetic alternatives)
  for (const [key, variants] of Object.entries(phoneticMappings)) {
    if (variants.some(variant => 
      surahLower.includes(variant) || variant.includes(surahLower)
    )) {
      if (voiceLower.includes(key) || key.includes(voiceLower)) {
        return 0.9;
      }
    }
  }
  
  return 0;
}

// Convert phonetically matched voice input to proper Surah name
function convertPhoneticToSurahName(voiceInput) {
  const phoneticMappings = {
         // Al-Fatiha variants
     'a lot': 'Al-Faatiha',
     'alot': 'Al-Faatiha',
     'a lot of': 'Al-Faatiha',
     'allah': 'Al-Faatiha',
     'al fatiha': 'Al-Faatiha',
     'alfatiha': 'Al-Faatiha',
     'fatiha': 'Al-Faatiha',
    
         // Al-Baqarah variants
     'back': 'Al-Baqara',
     'back are': 'Al-Baqara',
     'baker': 'Al-Baqara',
     'backer': 'Al-Baqara',
     'baqara': 'Al-Baqara',
     'bakara': 'Al-Baqara',
    
    // Al-Imran variants
    'all run': 'Al-Imran',
    'all ran': 'Al-Imran',
    'elmer': 'Al-Imran',
    'alimran': 'Al-Imran',
    
    // An-Nisa variants
    'and lisa': 'An-Nisa',
    'anissa': 'An-Nisa',
    'anisa': 'An-Nisa',
    'aneesa': 'An-Nisa',
    'annisa': 'An-Nisa',
    'enisa': 'An-Nisa',
    'a lisa': 'An-Nisa',
    
    // Al-Maidah variants
    'my dad': 'Al-Maidah',
    'my data': 'Al-Maidah',
    'almighty': 'Al-Maidah',
    
    // Al-Anam variants
    'and am': 'Al-Anam',
    'annam': 'Al-Anam',
    'and i am': 'Al-Anam',
    
    // Al-Araf variants
    'all rough': 'Al-Araf',
    'allraf': 'Al-Araf',
    'a rough': 'Al-Araf',
    
    // Al-Anfal variants
    'and fall': 'Al-Anfal',
    'and fell': 'Al-Anfal',
    'awful': 'Al-Anfal',
    
    // At-Tawbah variants
    'at toba': 'At-Tawbah',
    'at tuba': 'At-Tawbah',
    'a tuba': 'At-Tawbah',
    
    // Yunus variants
    'you miss': 'Yunus',
    'you ness': 'Yunus',
    'jonas': 'Yunus',
    
    // Yusuf variants
    'you surf': 'Yusuf',
    'joseph': 'Yusuf',
    'you suf': 'Yusuf',
    
    // Ibrahim variants
    'abraham': 'Ibrahim',
    'abe': 'Ibrahim',
    
    // Al-Kahf variants
    'all calf': 'Al-Kahf',
    'all half': 'Al-Kahf',
    'al calf': 'Al-Kahf',
    
    // Maryam variants
    'mary': 'Maryam',
    'maria': 'Maryam',
    'marry': 'Maryam',
    
    // Ta-Ha variants
    'ta ha': 'Ta-Ha',
    'taha': 'Ta-Ha',
    
    // Ya-Sin variants
    'ya sin': 'Ya-Sin',
    'yasin': 'Ya-Sin',
    'ya seen': 'Ya-Sin',
    'yes in': 'Ya-Sin',
    
         // Muhammad variants
     'mohamed': 'Muhammad',
     'mohammed': 'Muhammad',
     
     // Az-Zumar variants
     'azumar': 'Az-Zumar',
     'azuma': 'Az-Zumar',
     'ozumo': 'Az-Zumar',
     'azumah': 'Az-Zumar',
     'izumo': 'Az-Zumar',
     'zumar': 'Az-Zumar',
    
    // Ar-Rahman variants
    'our man': 'Ar-Rahman',
    'rahman': 'Ar-Rahman',
    'our rahman': 'Ar-Rahman',
    
    // Al-Ikhlas variants
    'all class': 'Al-Ikhlas',
    'all close': 'Al-Ikhlas',
    'a class': 'Al-Ikhlas',
    
         // An-Nas variants
     'and us': 'An-Nas',
     'and nas': 'An-Nas',
     'a nas': 'An-Nas',
     'anas': 'An-Nas',
     'nas': 'An-Nas',
     'agnes': 'An-Nas',
     'agnus': 'An-Nas',
     'honest': 'An-Nas',
    
         // Al-Falaq variants
     'all flack': 'Al-Falaq',
     'all flag': 'Al-Falaq',
     'a flag': 'Al-Falaq',
     'falak': 'Al-Falaq',
     'flak': 'Al-Falaq',
     
     // Additional common misheard variants
     'cow': 'Al-Baqarah',
     'the cow': 'Al-Baqarah',
     'women': 'An-Nisa',
     'the women': 'An-Nisa',
     'cave': 'Al-Kahf',
     'the cave': 'Al-Kahf',
     'light': 'An-Nur',
     'the light': 'An-Nur',
     'iron': 'Al-Hadid',
     'the iron': 'Al-Hadid',
     'moon': 'Al-Qamar',
     'the moon': 'Al-Qamar',
     'sun': 'Ash-Shams',
     'the sun': 'Ash-Shams',
     'night': 'Al-Layl',
     'the night': 'Al-Layl',
     'dawn': 'Al-Fajr',
     'the dawn': 'Al-Fajr',
     'elephant': 'Al-Fil',
     'the elephant': 'Al-Fil',
     'opening': 'Al-Fatiha',
     'the opening': 'Al-Fatiha'
  };
  
  const voiceLower = voiceInput.toLowerCase().trim();
  const mapped = phoneticMappings[voiceLower];
  
  if (mapped) {
    return mapped;
  }
  
  // If no phonetic mapping, try to standardize the format
  // Handle case variations like "al-fatiha" → "Al-Fatiha"
  if (voiceLower.startsWith('al-') || voiceLower.startsWith('an-') || voiceLower.startsWith('at-') || voiceLower.startsWith('ar-') || voiceLower.startsWith('as-') || voiceLower.startsWith('ash-')) {
    const parts = voiceInput.split('-');
    if (parts.length >= 2) {
      const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      const suffix = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
      const standardized = `${prefix}-${suffix}`;
      return standardized;
    }
  }
  
  // Capitalize first letter for single words
  const capitalized = voiceInput.charAt(0).toUpperCase() + voiceInput.slice(1).toLowerCase();
  if (capitalized !== voiceInput) {
    return capitalized;
  }
  
  return voiceInput;
}

function initVoiceSearch() {
  // Check if browser supports speech recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure speech recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5; // Get more alternatives for better matching
    
    // Set language based on current app language
    recognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
    
    // Handle speech recognition results
    recognition.onresult = function(event) {
      // Get all alternatives and find the best match
      const alternatives = [];
      for (let i = 0; i < event.results[0].length; i++) {
        alternatives.push(event.results[0][i].transcript.trim());
      }
      
      
      // Find the best matching alternative against Surah names
      const bestMatch = findBestSurahMatch(alternatives);
      let transcript = bestMatch || alternatives[0];
      
      // Convert phonetic matches to proper Surah names
      transcript = convertPhoneticToSurahName(transcript);
      
     
      // Set the search input value
      const searchInput = document.getElementById('surahSearchInput');
      searchInput.value = transcript;
      
      // Mobile-specific delay to ensure DOM is ready
      setTimeout(() => {
  
        // Try multiple event types for better mobile compatibility
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        const keyupEvent = new Event('keyup', { bubbles: true, cancelable: true });
        
        searchInput.dispatchEvent(inputEvent);
        searchInput.dispatchEvent(changeEvent);
        searchInput.dispatchEvent(keyupEvent);
        
                 // Direct function call with additional debugging
 
         // Ensure surah data is available before searching
         if ((!surahsData || surahsData.length === 0) && (!quickSurahList || quickSurahList.length === 0)) {
           // Try to initialize surah menu first
           if (typeof initializeSurahMenu === 'function') {
             initializeSurahMenu();
           }
           // Wait a bit more and try again
           setTimeout(() => {
             performEnhancedVoiceSearch(transcript);
           }, 200);
         } else {
         
           performEnhancedVoiceSearch(transcript);
         }
        
        // Additional check to see if search worked
        setTimeout(() => {
          const surahList = document.getElementById('surahList');
        }, 100);
        
      }, 100); // 100ms delay for mobile browsers
      
      // Stop listening
      stopVoiceSearch();
      
      // Show success feedback
      showVoiceSearchFeedback('success', currentLang === 'ar' ? 'تم البحث عن: ' + transcript : 'Searching for: ' + transcript);
    };
    
    // Handle speech recognition errors
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      stopVoiceSearch();
      
      let errorMessage = '';
      switch(event.error) {
        case 'no-speech':
          errorMessage = currentLang === 'ar' ? 'لم يتم سماع صوت' : 'No speech detected';
          break;
        case 'audio-capture':
          errorMessage = currentLang === 'ar' ? 'لا يمكن الوصول للميكروفون' : 'Microphone not accessible';
          break;
        case 'not-allowed':
          errorMessage = currentLang === 'ar' ? 'الرجاء السماح بالوصول للميكروفون' : 'Microphone permission denied';
          break;
        default:
          errorMessage = currentLang === 'ar' ? 'خطأ في البحث الصوتي' : 'Voice search error';
      }
      
      showVoiceSearchFeedback('error', errorMessage);
    };
    
    // Handle speech recognition end
    recognition.onend = function() {
      stopVoiceSearch();
    };
    
    return true;
  }
  return false;
}

function startVoiceSearch() {
  if (!recognition && !initVoiceSearch()) {
    // Browser doesn't support speech recognition
    showVoiceSearchFeedback('error', currentLang === 'ar' ? 'المتصفح لا يدعم البحث الصوتي' : 'Voice search not supported');
    return;
  }
  
  if (isListening) {
    stopVoiceSearch();
    return;
  }
  
  // Update language if changed
  recognition.lang ='ar';
  
  // Start listening
  isListening = true;
  recognition.start();
  
  // Update UI
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const voiceStatus = document.getElementById('voiceSearchStatus');
  const statusText = document.getElementById('voiceSearchStatusText');
  
  voiceBtn.innerHTML = '<i class="fas fa-stop text-white text-xs"></i>';
  voiceBtn.classList.add('animate-pulse');
  voiceBtn.title = currentLang === 'ar' ? 'إيقاف البحث الصوتي' : 'Stop voice search';
  
  voiceStatus.classList.remove('hidden');
  statusText.textContent = currentLang === 'ar' ? 'جاري الاستماع... قل اسم السورة' : 'Listening... Say surah name';
}

function stopVoiceSearch() {
  if (recognition) {
    recognition.stop();
  }
  
  isListening = false;
  
  // Update UI
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const voiceStatus = document.getElementById('voiceSearchStatus');
  
  voiceBtn.innerHTML = '<i class="fas fa-microphone text-white text-xs"></i>';
  voiceBtn.classList.remove('animate-pulse');
  voiceBtn.title = currentLang === 'ar' ? 'البحث الصوتي' : 'Voice Search';
  
  voiceStatus.classList.add('hidden');
}

function showVoiceSearchFeedback(type, message) {
  const statusDiv = document.getElementById('voiceSearchStatus');
  const statusText = document.getElementById('voiceSearchStatusText');
  const icon = statusDiv.querySelector('i');
  
  // Update icon and color based on type
  if (type === 'success') {
    icon.className = 'fas fa-check text-green-500 mr-1';
    statusText.className = 'text-green-600 dark:text-green-400';
  } else if (type === 'error') {
    icon.className = 'fas fa-exclamation-triangle text-red-500 mr-1';
    statusText.className = 'text-red-600 dark:text-red-400';
  }
  
  statusText.textContent = message;
  statusDiv.classList.remove('hidden');
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusDiv.classList.add('hidden');
    statusText.className = 'text-gray-600 dark:text-gray-400';
    icon.className = 'fas fa-circle text-red-500 animate-pulse mr-1';
  }, 3000);
}

// Prayer Settings Functions
function togglePrayerSettings() {
    const menu = document.getElementById('prayerSettingsMenu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => {
            menu.classList.remove('translate-x-full');
        }, 10);
        loadPrayerSettings();
    } else {
        menu.classList.add('translate-x-full');
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 200);
    }
}

function loadPrayerSettings() {
    // Load saved settings
    const prayerNotifications = localStorage.getItem('prayerNotifications') === 'true';
    const azanSound = localStorage.getItem('azanSound') || 'adhan.mp3';
    const asrCalculation = localStorage.getItem('asrCalculation') || 'shafi';
    const timeFormat = localStorage.getItem('is24HourFormat') === 'true';
    
    // Load notification times (new checkbox system)
    const notificationAtTime = localStorage.getItem('notificationAtTime') !== null ? localStorage.getItem('notificationAtTime') === 'true' : true; // Default to true
    const notification5min = localStorage.getItem('notification5min') === 'true';
    const notification10min = localStorage.getItem('notification10min') === 'true';
    const notification15min = localStorage.getItem('notification15min') === 'true';
    const notification30min = localStorage.getItem('notification30min') === 'true';
    
    // Update labels and dropdowns based on current language first
    updatePrayerSettingsLanguage();
    
    // Update UI
    document.getElementById('prayerNotificationToggle').checked = prayerNotifications;
    document.getElementById('azanSoundSelect').value = azanSound;
    document.getElementById('asrCalculationSelect').value = asrCalculation;
    document.getElementById('timeFormatToggle').checked = timeFormat;
    
    // Update notification checkboxes
    document.getElementById('notificationAtTime').checked = notificationAtTime;
    document.getElementById('notification5min').checked = notification5min;
    document.getElementById('notification10min').checked = notification10min;
    document.getElementById('notification15min').checked = notification15min;
    document.getElementById('notification30min').checked = notification30min;
}

function savePrayerSettings() {
    const prayerNotifications = document.getElementById('prayerNotificationToggle').checked;
    const azanSound = document.getElementById('azanSoundSelect').value;
    const asrCalculation = document.getElementById('asrCalculationSelect').value;
    const timeFormat = document.getElementById('timeFormatToggle').checked;
    
    // Get notification checkbox values
    const notificationAtTime = document.getElementById('notificationAtTime').checked;
    const notification5min = document.getElementById('notification5min').checked;
    const notification10min = document.getElementById('notification10min').checked;
    const notification15min = document.getElementById('notification15min').checked;
    const notification30min = document.getElementById('notification30min').checked;
    
    // Save to localStorage
    localStorage.setItem('prayerNotifications', prayerNotifications);
    localStorage.setItem('azanSound', azanSound);
    localStorage.setItem('asrCalculation', asrCalculation);
    localStorage.setItem('is24HourFormat', timeFormat);
    
    // Save notification times
    localStorage.setItem('notificationAtTime', notificationAtTime);
    localStorage.setItem('notification5min', notification5min);
    localStorage.setItem('notification10min', notification10min);
    localStorage.setItem('notification15min', notification15min);
    localStorage.setItem('notification30min', notification30min);
    
    // Update global variables
    is24HourFormat = timeFormat;
    
    // Update prayer times display
    updatePrayerTimeFormat();
    
    // Update notification settings
    if (prayerNotifications) {
        console.log("prayerNotifications", prayerNotifications);
        setupPrayerNotifications();
    } else {
        clearAllNotificationTimeouts();
    }
    
    // Show success message
    showToast(currentLang === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved successfully', 'success');
}

function updatePrayerSettingsLanguage() {
    const elements = {
        'prayerSettingsTitle': { ar: 'إعدادات الصلاة', en: 'Prayer Settings' },
        'notificationSettingsTitle': { ar: 'إشعارات أوقات الصلاة', en: 'Prayer Time Notifications' },
        'prayerNotificationLabel': { ar: 'تفعيل إشعارات أوقات الصلاة', en: 'Enable Prayer Time Notifications' },
        'prayerNotificationDesc': { ar: 'استقبل إشعارات في وقت الصلاة أو قبلها', en: 'Receive notifications at or before prayer times' },
        'azanSoundLabel': { ar: 'صوت الأذان', en: 'Adhan Sound' },
        'notificationTimeLabel': { ar: 'أوقات الإشعارات', en: 'Notification Times' },
        'notificationAtTimeLabel': { ar: 'في وقت الصلاة', en: 'At prayer time' },
        'notification5minLabel': { ar: '5 دقائق قبل', en: '5 minutes before' },
        'notification10minLabel': { ar: '10 دقائق قبل', en: '10 minutes before' },
        'notification15minLabel': { ar: '15 دقيقة قبل', en: '15 minutes before' },
        'notification30minLabel': { ar: '30 دقيقة قبل', en: '30 minutes before' },
        'calculationMethodTitle': { ar: 'طريقة حساب أوقات الصلاة', en: 'Prayer Time Calculation Method' },
        'asrCalculationLabel': { ar: 'حساب العصر', en: 'Asr Calculation' },
        'prayerOffsetsTitle': { ar: 'تعديل أوقات الصلاة', en: 'Prayer Time Adjustments' },
        'prayerOffsetsDesc': { ar: 'إضافة أو طرح دقائق من أوقات الصلاة المحسوبة', en: 'Add or subtract minutes from calculated prayer times' },
        'fajrOffsetLabel': { ar: 'الفجر', en: 'Fajr' },
        'dhuhrOffsetLabel': { ar: 'الظهر', en: 'Dhuhr' },
        'asrOffsetLabel': { ar: 'العصر', en: 'Asr' },
        'maghribOffsetLabel': { ar: 'المغرب', en: 'Maghrib' },
        'ishaOffsetLabel': { ar: 'العشاء', en: 'Isha' },
        'customAdhanLabel': { ar: 'رفع أذان مخصص', en: 'Upload Custom Adhan' },
        'uploadAdhanBtn': { ar: 'اختر ملف صوتي', en: 'Choose Audio File' },
        'testAdhanBtn': { ar: 'اختبار', en: 'Test' },
        'removeAdhanBtn': { ar: 'حذف', en: 'Remove' },
        'timeFormatSettingsTitle': { ar: 'تنسيق الوقت', en: 'Time Format' },
        'timeFormatLabel': { ar: 'تنسيق 24 ساعة', en: '24-Hour Format' },
        'timeFormatDesc': { ar: 'عرض الوقت بتنسيق 24 ساعة بدلاً من 12 ساعة', en: 'Display time in 24-hour format instead of 12-hour' }
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id][currentLang];
        }
    });
    
    // Update dropdown options based on current language
    updatePrayerSettingsDropdowns();
    
    // Update custom adhan dropdown if exists
    if (customAdhanData) {
        addCustomAdhanToDropdown();
    }
}

function updatePrayerSettingsDropdowns() {
    console.log('=== UPDATE PRAYER SETTINGS DROPDOWNS CALLED ===');
    console.log('customAdhanData at start of function:', !!customAdhanData);
    
    // Azan sound options
    const azanSoundSelect = document.getElementById('azanSoundSelect');
    const asrCalculationSelect = document.getElementById('asrCalculationSelect');
    
    if (!azanSoundSelect || !asrCalculationSelect) {
        console.log('Prayer settings dropdowns not found');
        return;
    }
    
    const azanOptions = {
        ar: [
            { value: 'adhan.mp3', text: 'الأذان الأساسي' },
            { value: 'adhan_makkah.mp3', text: 'أذان مكة المكرمة' },
            { value: 'adhan_madinah.mp3', text: 'أذان المدينة المنورة' },
            { value: 'adhan_egypt.mp3', text: 'أذان مصر' },
            { value: 'adhan_morocco.mp3', text: 'أذان المغرب' },
            { value: 'adhan_turkey.mp3', text: 'أذان تركيا' }
        ],
        en: [
            { value: 'adhan.mp3', text: 'Default Adhan' },
            { value: 'adhan_makkah.mp3', text: 'Makkah Adhan' },
            { value: 'adhan_madinah.mp3', text: 'Madinah Adhan' },
            { value: 'adhan_egypt.mp3', text: 'Egypt Adhan' },
            { value: 'adhan_morocco.mp3', text: 'Morocco Adhan' },
            { value: 'adhan_turkey.mp3', text: 'Turkey Adhan' }
        ]
    };
    
    // Asr calculation method options
    const asrCalculationOptions = {
        ar: [
            { value: 'shafi', text: 'شافعي' },
            { value: 'hanafi', text: 'حنفي' }
        ],
        en: [
            { value: 'shafi', text: 'Shafi\'i' },
            { value: 'hanafi', text: 'Hanafi' }
        ]
    };
    
    // Get saved values from localStorage instead of current dropdown values
    const currentAzanSound = localStorage.getItem('azanSound') || 'adhan.mp3';
    const currentAsrCalculation = localStorage.getItem('asrCalculation') || 'shafi';
    // Update azan sound options
    azanSoundSelect.innerHTML = '';
    azanOptions[currentLang].forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        optionElement.className = 'text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800';
        azanSoundSelect.appendChild(optionElement);
    });
    
    // Add custom adhan option if it exists (before restoring selection)
    if (customAdhanData) {
        addCustomAdhanToDropdown();
    }
    
    if(currentAzanSound){
        console.log("currentAzanSound", currentAzanSound);
    } else {
        console.log("currentAzanSound not found");
    }
    
    // Update asr calculation options
    asrCalculationSelect.innerHTML = '';
    asrCalculationOptions[currentLang].forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        optionElement.className = 'text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800';
        asrCalculationSelect.appendChild(optionElement);
    });
    
    // Set direction and text alignment based on language
    azanSoundSelect.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    asrCalculationSelect.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Set text alignment for better appearance
    azanSoundSelect.style.textAlign = currentLang === 'ar' ? 'right' : 'left';
    asrCalculationSelect.style.textAlign = currentLang === 'ar' ? 'right' : 'left';
    
    // Restore selected values
    console.log('=== DROPDOWN DEBUG ===');
    console.log('currentAzanSound from localStorage:', currentAzanSound);
    console.log('customAdhanData exists:', !!customAdhanData);
    console.log('Dropdown options before selection:');
    Array.from(azanSoundSelect.options).forEach((option, index) => {
        console.log(`Option ${index}: value="${option.value}", text="${option.textContent}"`);
    });
    
    if (currentAzanSound === 'custom_adhan') {
        if (!customAdhanData) {
            // If custom adhan was selected but data is not loaded, fall back to default
            console.log('Custom adhan selected but no data, falling back to default');
            azanSoundSelect.value = 'adhan.mp3';
        } else {
            // Ensure custom adhan option exists and set it
            const customOption = azanSoundSelect.querySelector('option[value="custom_adhan"]');
            console.log('Custom adhan option found in dropdown:', !!customOption);
            if (customOption) {
                console.log('Setting dropdown to custom_adhan');
                azanSoundSelect.value = 'custom_adhan';
            } else {
                // If custom option doesn't exist, add it and then set
                console.log('Custom adhan option not found, adding it');
                addCustomAdhanToDropdown();
                azanSoundSelect.value = 'custom_adhan';
            }
        }
    } else {
        console.log('Setting dropdown to:', currentAzanSound);
        azanSoundSelect.value = currentAzanSound;
    }
    
    console.log('Final dropdown value:', azanSoundSelect.value);
    console.log('Final dropdown selected text:', azanSoundSelect.options[azanSoundSelect.selectedIndex]?.textContent);
    console.log('=== END DEBUG ===');
    
    asrCalculationSelect.value = currentAsrCalculation;
}

    // Initialize prayer settings event listeners
    function initializePrayerSettings() {
        // Add event listeners for settings changes
        document.getElementById('prayerNotificationToggle').addEventListener('change', savePrayerSettings);
        document.getElementById('azanSoundSelect').addEventListener('change', savePrayerSettings);
        document.getElementById('asrCalculationSelect').addEventListener('change', savePrayerSettings);
        document.getElementById('timeFormatToggle').addEventListener('change', savePrayerSettings);
        
        // Add event listeners for notification time checkboxes
        document.getElementById('notificationAtTime').addEventListener('change', savePrayerSettings);
        document.getElementById('notification5min').addEventListener('change', savePrayerSettings);
        document.getElementById('notification10min').addEventListener('change', savePrayerSettings);
        document.getElementById('notification15min').addEventListener('change', savePrayerSettings);
        document.getElementById('notification30min').addEventListener('change', savePrayerSettings);
        
        // Add event listener for custom adhan upload
        const customAdhanInput = document.getElementById('customAdhanInput');
        if (customAdhanInput) {
            customAdhanInput.addEventListener('change', handleCustomAdhanUpload);
        }
        
        // Load custom adhan first (before prayer settings)
        loadCustomAdhan();
        
        // Load initial settings
        loadPrayerSettings();
        
        // Load prayer offsets
        loadPrayerOffsets();
        
        // Start countdown timer
        startCountdownTimer();
    }

// Function to show/hide coming prayer indicator and update countdown
function updateComingPrayerIndicator(nextPrayer = null) {
    // Hide all indicators first
    const indicators = document.querySelectorAll('.coming-prayer-indicator');
    indicators.forEach(indicator => {
        indicator.style.display = 'none';
    });
    
    // If no nextPrayer provided, determine it from current prayer times
    if (!nextPrayer && prayerNotifications && Object.keys(prayerNotifications).length > 0) {
        const now = new Date();
        const prayerOrder = ['Fajr', 'Sunrise', 'Duha', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        for (const prayerName of prayerOrder) {
            const prayerTimeStr = prayerNotifications[prayerName];
            if (!prayerTimeStr) continue;

            const [hours, minutes] = prayerTimeStr.split(':').map(Number);
            const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

            if (prayerDate > now) {
                nextPrayer = prayerName;
                break;
            }
        }
        
        // If no prayer found, default to Fajr
        if (!nextPrayer) {
            nextPrayer = 'Fajr';
        }
    }
    
    // Show indicator for the next prayer
    if (nextPrayer) {
        const indicator = document.getElementById(`coming-prayer-${nextPrayer.toLowerCase()}`);
        if (indicator) {
            indicator.style.display = 'block';
            // Update text based on language
            indicator.textContent = currentLang === 'ar' ? 'قادم' : 'Upcoming';
        }
        
        // Update countdown display
        updateCountdownDisplay(nextPrayer);
    }
}

// Function to update countdown display
function updateCountdownDisplay(nextPrayerName) {
    const countdownDisplay = document.getElementById('countdownDisplay');
    const nextPrayerNameElement = document.getElementById('nextPrayerName');
    const nextPrayerLabel = document.getElementById('nextPrayerLabel');
    
    if (!countdownDisplay || !nextPrayerNameElement || !nextPrayerLabel) return;
    
    if (!prayerNotifications || !prayerNotifications[nextPrayerName]) {
        countdownDisplay.textContent = '--:--:--';
        nextPrayerNameElement.textContent = '--';
        return;
    }
    
    const now = new Date();
    const prayerTimeStr = prayerNotifications[nextPrayerName];
    const [hours, minutes] = prayerTimeStr.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    // If prayer time has passed today, calculate for tomorrow
    if (prayerDate <= now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const timeDiff = prayerDate - now;
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Format countdown
    const countdownText = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    countdownDisplay.textContent = countdownText;
    
    // Update prayer name
    const prayerNames = {
        'Fajr': { ar: 'الفجر', en: 'Fajr' },
        'Sunrise': { ar: 'الشروق', en: 'Sunrise' },
        'Duha': { ar: 'الضحى', en: 'Duha' },
        'Dhuhr': { ar: 'الظهر', en: 'Dhuhr' },
        'Asr': { ar: 'العصر', en: 'Asr' },
        'Maghrib': { ar: 'المغرب', en: 'Maghrib' },
        'Isha': { ar: 'العشاء', en: 'Isha' }
    };
    
    nextPrayerNameElement.textContent = prayerNames[nextPrayerName] ? prayerNames[nextPrayerName][currentLang] : nextPrayerName;
    nextPrayerLabel.textContent = currentLang === 'ar' ? 'الوقت المتبقي للصلاة القادمة' : 'Time until next prayer';
}

// Function to start countdown timer
function startCountdownTimer() {
    setInterval(() => {
        if (prayerNotifications && Object.keys(prayerNotifications).length > 0) {
            const now = new Date();
            const prayerOrder = ['Fajr', 'Sunrise', 'Duha', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            let nextPrayer = null;
            
            for (const prayerName of prayerOrder) {
                const prayerTimeStr = prayerNotifications[prayerName];
                if (!prayerTimeStr) continue;

                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

                if (prayerDate > now) {
                    nextPrayer = prayerName;
                    break;
                }
            }
            
            if (nextPrayer) {
                updateCountdownDisplay(nextPrayer);
            }
        }
    }, 1000); // Update every second
}

// Prayer time offset functions
let prayerOffsets = {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
};

// Function to adjust prayer time offset
function adjustPrayerOffset(prayer, change) {
    const offsetElement = document.getElementById(`${prayer}Offset`);
    if (!offsetElement) return;
    
    prayerOffsets[prayer] += change;
    
    // Limit offset to reasonable range (-30 to +30 minutes)
    if (prayerOffsets[prayer] < -30) prayerOffsets[prayer] = -30;
    if (prayerOffsets[prayer] > 30) prayerOffsets[prayer] = 30;
    
    // Update display
    const sign = prayerOffsets[prayer] >= 0 ? '+' : '';
    offsetElement.textContent = `${sign}${prayerOffsets[prayer]}`;
    
    // Save to localStorage
    localStorage.setItem('prayerOffsets', JSON.stringify(prayerOffsets));
    
    // Update prayer times display with new offsets
    updatePrayerTimesWithOffsets();
}

// Function to load prayer offsets
function loadPrayerOffsets() {
    const saved = localStorage.getItem('prayerOffsets');
    if (saved) {
        prayerOffsets = JSON.parse(saved);
    }
    
    // Update UI
    Object.keys(prayerOffsets).forEach(prayer => {
        const offsetElement = document.getElementById(`${prayer}Offset`);
        if (offsetElement) {
            const sign = prayerOffsets[prayer] >= 0 ? '+' : '';
            offsetElement.textContent = `${sign}${prayerOffsets[prayer]}`;
        }
    });
}

    // Function to update prayer times display with offsets
    function updatePrayerTimesWithOffsets() {
        if (!prayerNotifications) return;
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        prayers.forEach(prayer => {
            const prayerLower = prayer.toLowerCase();
            const prayerTimeStr = prayerNotifications[prayer];
            if (!prayerTimeStr) return;
            
            const [hours, minutes] = prayerTimeStr.split(':').map(Number);
            const offset = prayerOffsets[prayerLower] || 0;
            
            // Apply offset
            let newMinutes = minutes + offset;
            let newHours = hours;
            
            // Handle overflow
            if (newMinutes >= 60) {
                newHours += Math.floor(newMinutes / 60);
                newMinutes = newMinutes % 60;
            } else if (newMinutes < 0) {
                newHours -= Math.ceil(Math.abs(newMinutes) / 60);
                newMinutes = 60 + (newMinutes % 60);
            }
            
            // Handle day overflow
            if (newHours >= 24) {
                newHours -= 24;
            } else if (newHours < 0) {
                newHours += 24;
            }
            
            // Update display
            const timeElement = document.querySelector(`#azan-${prayerLower.toLowerCase()} .font-bold`);
            if (timeElement) {
                const formattedTime = formatTime(`${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`);
                timeElement.textContent = formattedTime;
            }
        });
    }

    // Function to update prayer offsets language
    function updatePrayerOffsetsLanguage() {
        const elements = {
            'prayerOffsetsTitle': { ar: 'تعديل أوقات الصلاة', en: 'Prayer Time Adjustments' },
            'prayerOffsetsDesc': { ar: 'إضافة أو طرح دقائق من أوقات الصلاة المحسوبة', en: 'Add or subtract minutes from calculated prayer times' },
            'fajrOffsetLabel': { ar: 'الفجر', en: 'Fajr' },
            'dhuhrOffsetLabel': { ar: 'الظهر', en: 'Dhuhr' },
            'asrOffsetLabel': { ar: 'العصر', en: 'Asr' },
            'maghribOffsetLabel': { ar: 'المغرب', en: 'Maghrib' },
            'ishaOffsetLabel': { ar: 'العشاء', en: 'Isha' }
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id][currentLang];
            }
        });
    }

    // Custom Adhan Upload Functions
    let customAdhanData = null;
    let customAdhanAudio = null;

    // Function to handle custom adhan file upload
    function handleCustomAdhanUpload(event) {
        console.log('=== CUSTOM ADHAN UPLOAD STARTED ===');
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File selected:', file.name, file.size, file.type);

        // Validate file type
        const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac'];
        if (!allowedTypes.includes(file.type)) {
            console.log('File type not supported:', file.type);
            showToast(currentLang === 'ar' ? 'يرجى اختيار ملف صوتي صالح (.mp3, .wav, .m4a)' : 'Please select a valid audio file (.mp3, .wav, .m4a)', 'error');
            return;
        }

        // Dynamic file size limit based on available localStorage space
        const getMaxFileSize = () => {
            try {
                // Test with different sizes to find available space
                const testSizes = [3, 2, 1, 0.5]; // MB
                for (const sizeMB of testSizes) {
                    const testSize = sizeMB * 1024 * 1024;
                    const base64Size = Math.ceil(testSize * 1.35); // Base64 overhead
                    const jsonSize = base64Size + 1000; // JSON overhead
                    
                    if (checkLocalStorageCapacity(jsonSize)) {
                        return testSize;
                    }
                }
                return 0.5 * 1024 * 1024; // Fallback to 0.5MB
            } catch (error) {
                return 1 * 1024 * 1024; // Fallback to 1MB
            }
        };
        
        const maxSize = getMaxFileSize();
        const maxSizeMB = Math.round(maxSize / (1024 * 1024) * 10) / 10; // Round to 1 decimal
        
        if (file.size > maxSize) {
            console.log('File too large:', file.size, 'max:', maxSize, 'available space allows:', maxSizeMB + 'MB');
            showToast(currentLang === 'ar' ? 
                `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت` : 
                `File size too large. Maximum ${maxSizeMB}MB`, 'error');
            return;
        }

        // Read file as ArrayBuffer
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File read successfully, size:', e.target.result.byteLength);
            const arrayBuffer = e.target.result;
            
            // Store custom adhan data
            customAdhanData = {
                name: file.name,
                size: file.size,
                type: file.type,
                data: arrayBuffer,
                timestamp: Date.now()
            };
            console.log('customAdhanData created:', customAdhanData.name, customAdhanData.size);

            // Save to localStorage
            console.log('Calling saveCustomAdhan()...');
            saveCustomAdhan();

            // Update UI
            updateCustomAdhanUI();

            // Add to dropdown
            addCustomAdhanToDropdown();

            showToast(currentLang === 'ar' ? 'تم رفع الأذان المخصص بنجاح' : 'Custom adhan uploaded successfully', 'success');
            console.log('=== CUSTOM ADHAN UPLOAD COMPLETED ===');
        };

        reader.readAsArrayBuffer(file);
    }

    // Function to check localStorage capacity
    function checkLocalStorageCapacity(dataSize) {
        try {
            const testKey = 'storage_test';
            const testData = 'x'.repeat(dataSize);
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Function to save custom adhan to localStorage
    function saveCustomAdhan() {
        console.log('=== SAVING CUSTOM ADHAN ===');
        if (customAdhanData) {
            console.log('customAdhanData exists, size:', customAdhanData.size);
            try {
                // Check file size - use dynamic limit based on available space
                const getMaxFileSize = () => {
                    try {
                        // Test with different sizes to find available space
                        const testSizes = [3, 2, 1, 0.5]; // MB
                        for (const sizeMB of testSizes) {
                            const testSize = sizeMB * 1024 * 1024;
                            const base64Size = Math.ceil(testSize * 1.35); // Base64 overhead
                            const jsonSize = base64Size + 1000; // JSON overhead
                            
                            if (checkLocalStorageCapacity(jsonSize)) {
                                return testSize;
                            }
                        }
                        return 0.5 * 1024 * 1024; // Fallback to 0.5MB
                    } catch (error) {
                        return 1 * 1024 * 1024; // Fallback to 1MB
                    }
                };
                
                const maxSize = getMaxFileSize();
                const maxSizeMB = Math.round(maxSize / (1024 * 1024) * 10) / 10; // Round to 1 decimal
                
                if (customAdhanData.size > maxSize) {
                    console.log('File too large for localStorage, max allowed:', maxSizeMB + 'MB');
                    showToast(currentLang === 'ar' ? 
                        `الملف كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت` : 
                        `File too large. Maximum size is ${maxSizeMB}MB`, 'error');
                    return;
                }
                
                // Convert ArrayBuffer to base64 for storage using a more efficient method
                console.log('Starting base64 conversion...');
                const uint8Array = new Uint8Array(customAdhanData.data);
                console.log('Uint8Array created, length:', uint8Array.length);
                let binaryString = '';
                const chunkSize = 8192; // Process in chunks to avoid stack overflow
                
                console.log('Processing chunks...');
                for (let i = 0; i < uint8Array.length; i += chunkSize) {
                    const chunk = uint8Array.slice(i, i + chunkSize);
                    binaryString += String.fromCharCode.apply(null, chunk);
                }
                console.log('Binary string created, length:', binaryString.length);
                
                console.log('Converting to base64...');
                const base64 = btoa(binaryString);
                console.log('Base64 conversion completed, length:', base64.length);
                
                const dataToSave = {
                    ...customAdhanData,
                    data: base64
                };
                console.log('Data object created for saving');
                
                console.log('Converting to JSON...');
                const dataString = JSON.stringify(dataToSave);
                console.log('JSON string created, length:', dataString.length);
                
                // Check if we have enough space before saving
                console.log('Checking localStorage capacity...');
                if (!checkLocalStorageCapacity(dataString.length)) {
                    console.log('Not enough localStorage space');
                    showToast(currentLang === 'ar' ? 
                        'لا توجد مساحة كافية في التخزين المحلي. يرجى حذف بعض البيانات أو استخدام ملف أصغر' : 
                        'Not enough storage space. Please clear some data or use a smaller file', 'error');
                    return;
                }
                console.log('localStorage capacity check passed');
                
                console.log('Saving to localStorage...');
                localStorage.setItem('customAdhan', dataString);
                console.log('Custom adhan saved to localStorage successfully');
            } catch (error) {
                console.error('Error saving custom adhan:', error);
                if (error.name === 'QuotaExceededError') {
                    showToast(currentLang === 'ar' ? 
                        'لا توجد مساحة كافية في التخزين المحلي. يرجى استخدام ملف أصغر من 1 ميجابايت' : 
                        'Not enough storage space. Please use a file smaller than 1MB', 'error');
                } else {
                    showToast(currentLang === 'ar' ? 'خطأ في حفظ الأذان المخصص' : 'Error saving custom adhan', 'error');
                }
            }
        } else {
            console.log('No customAdhanData to save');
        }
        console.log('=== END SAVING CUSTOM ADHAN ===');
    }

    // Function to load custom adhan from localStorage
    function loadCustomAdhan() {
        console.log('=== LOADING CUSTOM ADHAN ===');
        try {
            const saved = localStorage.getItem('customAdhan');
            console.log('Saved custom adhan in localStorage:', !!saved);
            if (saved) {
                const data = JSON.parse(saved);
                console.log('Parsed custom adhan data:', data.name, data.size);
                
                // Convert base64 back to ArrayBuffer
                const binaryString = atob(data.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                customAdhanData = {
                    ...data,
                    data: bytes.buffer
                };
                console.log('customAdhanData set:', !!customAdhanData);

                updateCustomAdhanUI();
                addCustomAdhanToDropdown();
                
                // Restore dropdown selection if custom adhan was previously selected
                const select = document.getElementById('azanSoundSelect');
                if (select && localStorage.getItem('azanSound') === 'custom_adhan') {
                    select.value = 'custom_adhan';
                }
            } else {
                console.log('No custom adhan found in localStorage');
            }
        } catch (error) {
            console.error('Error loading custom adhan:', error);
            // Clear corrupted data
            localStorage.removeItem('customAdhan');
        }
        console.log('=== END LOADING CUSTOM ADHAN ===');
    }

    // Function to update custom adhan UI
    function updateCustomAdhanUI() {
        const infoDiv = document.getElementById('customAdhanInfo');
        const actionsDiv = document.getElementById('customAdhanActions');
        const nameDiv = document.getElementById('customAdhanName');
        const sizeDiv = document.getElementById('customAdhanSize');

        if (customAdhanData) {
            infoDiv.classList.remove('hidden');
            actionsDiv.classList.remove('hidden');
            
            nameDiv.textContent = customAdhanData.name;
            sizeDiv.textContent = formatFileSize(customAdhanData.size);
        } else {
            infoDiv.classList.add('hidden');
            actionsDiv.classList.add('hidden');
        }
    }

    // Function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Function to add custom adhan to dropdown
    function addCustomAdhanToDropdown() {
        const select = document.getElementById('azanSoundSelect');
        if (!select || !customAdhanData) return;

        // Remove existing custom option if any
        const existingCustom = select.querySelector('option[value="custom_adhan"]');
        if (existingCustom) {
            existingCustom.remove();
        }

        // Add new custom option
        const option = document.createElement('option');
        option.value = 'custom_adhan';
        option.textContent = currentLang === 'ar' ? 
            `أذان مخصص - ${customAdhanData.name}` : 
            `Custom Adhan - ${customAdhanData.name}`;
        option.className = 'text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800';
        
        select.appendChild(option);
    }

    // Function to test custom adhan
    function testCustomAdhan() {
        if (!customAdhanData) return;

        try {
            // Create blob URL
            const blob = new Blob([customAdhanData.data], { type: customAdhanData.type });
            const url = URL.createObjectURL(blob);

            // Create and play audio
            if (customAdhanAudio) {
                customAdhanAudio.pause();
                URL.revokeObjectURL(customAdhanAudio.src);
            }

            customAdhanAudio = new Audio(url);
            customAdhanAudio.play();

            // Clean up after playing
            customAdhanAudio.onended = function() {
                URL.revokeObjectURL(url);
            };

            showToast(currentLang === 'ar' ? 'جاري تشغيل الأذان المخصص...' : 'Playing custom adhan...', 'info');
        } catch (error) {
            console.error('Error playing custom adhan:', error);
            showToast(currentLang === 'ar' ? 'خطأ في تشغيل الأذان المخصص' : 'Error playing custom adhan', 'error');
        }
    }

    // Function to remove custom adhan
    function removeCustomAdhan() {
        if (customAdhanAudio) {
            customAdhanAudio.pause();
            URL.revokeObjectURL(customAdhanAudio.src);
            customAdhanAudio = null;
        }

        customAdhanData = null;
        localStorage.removeItem('customAdhan');

        // Remove from dropdown
        const select = document.getElementById('azanSoundSelect');
        const customOption = select.querySelector('option[value="custom_adhan"]');
        if (customOption) {
            customOption.remove();
        }

        // Reset dropdown to default if custom was selected
        if (select.value === 'custom_adhan') {
            select.value = 'adhan.mp3';
        }

        updateCustomAdhanUI();
        showToast(currentLang === 'ar' ? 'تم حذف الأذان المخصص' : 'Custom adhan removed', 'success');
    }

    // Function to play custom adhan for notifications
    function playCustomAdhan() {
        if (!customAdhanData) return null;

        try {
            const blob = new Blob([customAdhanData.data], { type: customAdhanData.type });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            
            // Clean up URL after playing
            audio.onended = function() {
                URL.revokeObjectURL(url);
            };

            return audio;
        } catch (error) {
            console.error('Error creating custom adhan audio:', error);
            return null;
        }
    }

    // Function to update URL with current verse for sharing
    function updateVerseURL() {
        if (currentSurah !== null && currentAyah !== null && quranData) {
            const surah = quranData[currentSurah];
            if (surah) {
                const surahName = surah.name || `Surah ${currentSurah + 1}`;
                const ayahNumber = surah.ayahs[currentAyah]?.numberInSurah || currentAyah + 1;
                
                // Create shareable URL
                const shareURL = `${window.location.origin}${window.location.pathname}#quran/${currentSurah + 1}/${ayahNumber}`;
                
                // Update browser URL without reloading
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', shareURL);
                }
                
                // Share functionality is now handled through the ayah menu popover
            }
        }
    }

    // Function to update share button with current verse (now handled in menu)
    function updateShareButton(shareURL, surahName, ayahNumber) {
        // Share functionality is now handled through the ayah menu popover
        // This function is kept for compatibility but no longer creates a separate button
    }

    // Function to share verse
    function shareVerse(shareURL, surahName, ayahNumber) {
        const verseText = currentLang === 'ar' ? 
            `آية من ${surahName} - الآية ${ayahNumber}` : 
            `Verse from ${surahName} - Verse ${ayahNumber}`;
        
        // Better mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                        window.innerWidth <= 768;
        
        console.log('Share function called');
        console.log('isMobile:', isMobile);
        console.log('navigator.share available:', !!navigator.share);
        console.log('User agent:', navigator.userAgent);
        console.log('maxTouchPoints:', navigator.maxTouchPoints);
        console.log('window.innerWidth:', window.innerWidth);
        
        // Only use native sharing on mobile devices
        if (navigator.share && isMobile) {
            const shareData = {
                title: verseText,
                text: verseText,
                url: shareURL
            };
            
            console.log('Attempting native share with data:', shareData);
            
            navigator.share(shareData)
                .then(() => {
                    console.log('Share successful');
                    showToast(currentLang === 'ar' ? 'تم المشاركة بنجاح' : 'Shared successfully', 'success');
                })
                .catch(err => {
                    console.log('Share failed:', err);
                    console.log('Error name:', err.name);
                    // Only fall back to clipboard if it's not a user cancellation
                    if (err.name !== 'AbortError') {
                        copyToClipboard(shareURL);
                    }
                });
        } else {
            console.log('Native sharing not available - isMobile:', isMobile, 'navigator.share:', !!navigator.share);
            copyToClipboard(shareURL);
        }
    }

    // Function to copy URL to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(currentLang === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard', 'success');
            }).catch(err => {
                console.log('Error copying to clipboard:', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }

    // Fallback copy function for older browsers
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(currentLang === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard', 'success');
        } catch (err) {
            console.log('Fallback copy failed:', err);
            showToast(currentLang === 'ar' ? 'فشل في نسخ الرابط' : 'Failed to copy link', 'error');
        }
        document.body.removeChild(textArea);
    }

    // Function to handle URL hash changes
    function handleHashChange() {
        console.log('Handling hash change...');
        const hash = window.location.hash;
        console.log('Current hash:', hash);
        
        if (hash && hash.startsWith('#quran/')) {
            const parts = hash.substring(7).split('/');
            console.log('Hash parts:', parts);
            
            if (parts.length >= 2) {
                const surahIndex = parseInt(parts[0]) - 1; // Convert to 0-based index
                const ayahIndex = parseInt(parts[1]) - 1; // Convert to 0-based index
                
                console.log('Parsed indices - surah:', surahIndex, 'ayah:', ayahIndex);
                console.log('Quran data available:', !!quranData, 'length:', quranData?.length);
                
                // Validate indices
                if (surahIndex >= 0 && surahIndex < quranData.length) {
                    const surah = quranData[surahIndex];
                    console.log('Surah found:', surah?.name, 'ayahs count:', surah?.ayahs?.length);
                    
                    if (ayahIndex >= 0 && ayahIndex < surah.ayahs.length) {
                        console.log('Navigating to verse...');
                        
                        // Store target values
                        const targetSurah = surahIndex;
                        const targetAyah = ayahIndex;
                        
                        console.log('Target values - surah:', targetSurah, 'ayah:', targetAyah);
                        
                        // Switch to Quran tab first
                        console.log('Switching to Quran tab...');
                        switchTab('quran');
                        
                        // Wait for tab switch to complete, then set values and display
                        setTimeout(() => {
                            console.log('Setting values after tab switch...');
                            currentSurah = targetSurah;
                            currentAyah = targetAyah;
                            console.log('Set currentSurah to:', currentSurah, 'currentAyah to:', currentAyah);
                            
                            // Update surah menu and dropdown
                            updateSurahMenuForCurrentSurah();
                            
                            displayAyah();
                        }, 200);
                        return;
                    } else {
                        console.log('Invalid ayah index:', ayahIndex, 'max:', surah.ayahs.length);
                    }
                } else {
                    console.log('Invalid surah index:', surahIndex, 'max:', quranData.length);
                }
            } else {
                console.log('Invalid hash format, expected at least 2 parts');
            }
        } else {
            console.log('Hash does not start with #quran/');
        }
    }

    // Function to switch tabs programmatically
    function switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // Find the tab element
        const tab = document.querySelector(`[data-tab="${tabId}"]`);
        if (!tab) {
            console.log('Tab not found:', tabId);
            return;
        }
        
        // Get current active tab
        const previousActiveTab = document.querySelector('.tab.active');
        const previousTabId = previousActiveTab ? previousActiveTab.getAttribute('data-tab') : null;
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to target tab and content
        tab.classList.add('active');
        document.getElementById(`${tabId}Content`).classList.add('active');
        
        // Handle Quran controls visibility
        const controls = getQuranControls();
        if (controls) {
            if (tabId === 'quran') {
                controls.style.display = 'flex';
                controls.classList.remove('quran-controls-hidden');
                console.log('Quran controls shown');
            } else {
                controls.style.display = 'none';
                console.log('Quran controls hidden');
            }
        }
        
        // Handle other tab-specific logic
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        // Reset reading mode when switching away from Quran tab
        if (previousTabId === 'quran' && tabId !== 'quran' && isReadingMode) {
            isReadingMode = false;
            const btnReadingMode = document.getElementById('btnReadingMode');
            if (btnReadingMode) {
                btnReadingMode.innerHTML = '<i class="fas fa-book-open w-3 h-3"></i>';
            }
            // Remove scroll listener
            if (window.currentScrollListener) {
                window.removeEventListener('scroll', window.currentScrollListener);
                window.currentScrollListener = null;
            }
            // Hide page/Juz indicator
            hidePageJuzIndicator();
        }
        
        // Stop compass when switching away from Qibla tab
        if (previousTabId === 'qibla' && tabId !== 'qibla') {
            stopCompass();
        }
        
        // Handle Quran tab specific logic
        if (tabId === 'quran') {
            // Load Quran data asynchronously without blocking UI
            (async () => {
                try {
                    if (!quranData || !translationData) {
                        await loadQuranData();
                    } else {
                        resetQuranContent();
                    }
                    
                    // Initialize Quran search if not already done
                    const searchInput = document.getElementById('quranSearchInput');
                    if (searchInput && !searchInput.hasAttribute('data-initialized')) {
                        initializeQuranSearch();
                        searchInput.setAttribute('data-initialized', 'true');
                    }
                } catch (error) {
                    const arabicText = document.getElementById('arabicText');
                    if (arabicText) {
                        arabicText.innerHTML = `
                            <div class="text-red-500 dark:text-red-400 py-8">
                                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                                <p class="text-xl">${currentLang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}</p>
                                <p class="text-sm mt-4">${error.message}</p>
                            </div>
                        `;
                    }
                }
            })();
        }

        // Handle video tab specific logic
        if (tabId === 'video') {
            console.log('switchTab: Video tab selected, initializing video generator...');
            initializeVideoGenerator();
        }
    }

    // Function to update surah menu and dropdown for current surah
    function updateSurahMenuForCurrentSurah() {
        if (currentSurah === null || !quranData) return;
        
        console.log('Updating surah menu for surah:', currentSurah);
        
        // Update surah dropdown using existing function
        updateSurahDropdown();
        
        // Hide quick surahs section when a surah is selected
        const quickSurahsSection = document.getElementById('quickSurahsSection');
        if (quickSurahsSection) {
            quickSurahsSection.style.display = 'none';
            console.log('Hidden quick surahs section');
        }
        
        // Update surah menu if it's open
        const surahMenu = document.getElementById('surahMenu');
        if (surahMenu && !surahMenu.classList.contains('hidden')) {
            // Remove active class from all surah items
            const allSurahItems = surahMenu.querySelectorAll('.surah-item');
            allSurahItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to current surah
            const currentSurahItem = surahMenu.querySelector(`[data-surah-index="${currentSurah}"]`);
            if (currentSurahItem) {
                currentSurahItem.classList.add('active');
                console.log('Updated surah menu active item');
            }
        }
        
        // Update quick surahs if they exist
        const quickSurahs = document.querySelectorAll('.quick-surah');
        quickSurahs.forEach(item => {
            const surahIndex = parseInt(item.getAttribute('data-surah'));
            if (surahIndex === currentSurah + 1) { // +1 because data-surah is 1-based
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initialize URL handling
    function initializeURLHandling() {
        console.log('Initializing URL handling...');
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        // Handle initial hash on page load
        if (window.location.hash) {
            console.log('Found hash in URL:', window.location.hash);
            // Wait for Quran data to load before processing hash
            const checkDataLoaded = setInterval(() => {
                if (quranData && quranData.length > 0) {
                    console.log('Quran data loaded, processing hash...');
                    clearInterval(checkDataLoaded);
                    handleHashChange();
                }
            }, 100);
            
            // Timeout after 10 seconds to prevent infinite waiting
            setTimeout(() => {
                clearInterval(checkDataLoaded);
                console.log('Timeout waiting for Quran data to load');
            }, 10000);
        }
    }

    // Initialize scroll handler
    initScrollHandler();
    
    // Re-initialize when DOM changes (for tab switching)
    const observer = new MutationObserver(() => {
        const controls = getQuranControls();
        if (controls && !scrollHandler) {
            initScrollHandler();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Video Generation Functions
    let videoGeneratorInitialized = false;
    let selectedVideoSurah = null;
    let selectedVideoAyah = null;
    let selectedVideoAyahTo = null; // For verse ranges
    let selectedVideoReciter = null;
    let selectedBackground = null;
    let customBackgroundFile = null;

    // Initialize video generator
    function initializeVideoGenerator() {
        console.log('=== VIDEO GENERATOR INITIALIZATION START ===');
        
        if (videoGeneratorInitialized) {
            console.log('Video generator already initialized, skipping...');
            return;
        }
        
        console.log('Initializing video generator...');
        console.log('Current Quran data status:', !!quranData);
        console.log('Current translation data status:', !!translationData);
        
        // Load reciters
        console.log('Loading reciters...');
        loadVideoReciters();
        
        // Load backgrounds
        console.log('Loading backgrounds...');
        loadVideoBackgrounds();
        
        // Load fonts
        console.log('Loading fonts...');
        loadVideoFonts();
        
        // Load surahs for video generation
        console.log('Loading surahs...');
        loadVideoSurahs();
        
        // Setup event listeners
        console.log('Setting up event listeners...');
        setupVideoEventListeners();
        
        // Setup video tabs
        console.log('Setting up video tabs...');
        setupVideoTabs();
        
        // Update language
        console.log('Updating language...');
        updateVideoLanguage();
        
        // Update orientation preview initially
        console.log('Setting initial orientation preview...');
        updateOrientationPreview();
        
        // Show a helpful message if server is not running
        setTimeout(() => {
            const reciterSelect = document.getElementById('videoReciterSelect');
            const backgroundGrid = document.getElementById('backgroundGrid');
            
            console.log('Checking server connection status...');
            console.log('Reciter select children count:', reciterSelect ? reciterSelect.children.length : 'Element not found');
            
            if (reciterSelect && reciterSelect.children.length <= 1) {
                showToast(currentLang === 'ar' ? 
                    'ملاحظة: خادم الفيديو غير متصل. بعض الميزات قد لا تعمل.' : 
                    'Note: Video server not connected. Some features may not work.', 'info');
            }
        }, 2000);
        
        videoGeneratorInitialized = true;
        console.log('=== VIDEO GENERATOR INITIALIZATION COMPLETE ===');
    }

    // Load reciters for video generation
    async function loadVideoReciters() {
        console.log('loadVideoReciters: Starting...');
        try {
            console.log('loadVideoReciters: Fetching from https://adkar.zeabur.app/api/reciters...');
            const response = await fetch('https://adkar.zeabur.app/api/reciters');
            console.log('loadVideoReciters: Response status:', response.status);
            const reciters = await response.json();
            console.log('loadVideoReciters: Received reciters:', reciters);
            
            const reciterSelect = document.getElementById('videoReciterSelect');
            console.log('loadVideoReciters: Found reciter select element:', !!reciterSelect);
            if (reciterSelect) {
                reciterSelect.innerHTML = '<option value="">اختر القارئ</option>';
                reciters.forEach(reciter => {
                    const option = document.createElement('option');
                    option.value = reciter.id;
                    option.textContent = reciter.name;
                    reciterSelect.appendChild(option);
                });
                console.log('loadVideoReciters: Added', reciters.length, 'reciters to dropdown');
            } else {
                console.error('loadVideoReciters: Reciter select element not found!');
            }
        } catch (error) {
            console.error('loadVideoReciters: Error loading reciters:', error);
            // Fallback to hardcoded reciters if server is not available
            const fallbackReciters = [
                { id: 'abdul_basit', name: 'Abdul Basit Abdul Samad' },
                { id: 'mishary_rashid', name: 'Mishary Rashid Alafasy' },
                { id: 'sudais', name: 'Abdur-Rahman As-Sudais' },
                { id: 'shuraim', name: 'Saud Al-Shuraim' },
                { id: 'ghamdi', name: 'Saad Al-Ghamdi' },
                { id: 'husary', name: 'Mahmoud Khalil Al-Husary' },
                { id: 'muhammad_siddiq', name: 'Muhammad Siddiq Al-Minshawi' }
            ];
            
            const reciterSelect = document.getElementById('videoReciterSelect');
            if (reciterSelect) {
                reciterSelect.innerHTML = '<option value="">اختر القارئ</option>';
                fallbackReciters.forEach(reciter => {
                    const option = document.createElement('option');
                    option.value = reciter.id;
                    option.textContent = reciter.name;
                    reciterSelect.appendChild(option);
                });
                console.log('loadVideoReciters: Added fallback reciters');
            }
        }
    }

    // Load fonts for video generation
    async function loadVideoFonts() {
        try {
            console.log('loadVideoFonts: Starting...');
            const response = await fetch('https://adkar.zeabur.app/api/fonts');
            console.log('loadVideoFonts: Response status:', response.status);
            const fonts = await response.json();
            console.log('loadVideoFonts: Received fonts:', fonts);
            
            const fontSelect = document.getElementById('videoFontFamily');
            console.log('loadVideoFonts: Found font select element:', !!fontSelect);
            
            if (fontSelect && fonts && fonts.length > 0) {
                fontSelect.innerHTML = '<option value="">اختر نوع الخط</option>';
                fonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font.family;
                    option.textContent = font.name;
                    fontSelect.appendChild(option);
                });
                console.log('loadVideoFonts: Added', fonts.length, 'fonts to dropdown');
                
                // Set default font
                fontSelect.value = 'Uthmanic Hafs';
                updateFontPreview();
            } else {
                console.error('loadVideoFonts: Font select element not found or no fonts received!');
            }
        } catch (error) {
            console.error('loadVideoFonts: Error loading fonts:', error);
            // Add fallback fonts - only keeping Al Mushaf and Uthmanic Hafs (old)
            const fallbackFonts = [
                { family: 'Uthmanic Hafs', name: 'Uthmanic Hafs (Old)' },
                { family: 'Al Mushaf', name: 'Al Mushaf' }
            ];
            
            const fontSelect = document.getElementById('videoFontFamily');
            if (fontSelect) {
                fontSelect.innerHTML = '<option value="">اختر نوع الخط</option>';
                fallbackFonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font.family;
                    option.textContent = font.name;
                    fontSelect.appendChild(option);
                });
                fontSelect.value = 'Uthmanic Hafs';
                updateFontPreview();
                console.log('loadVideoFonts: Added fallback fonts');
            }
        }
    }

    // Update font preview
    function updateFontPreview() {
        const fontSelect = document.getElementById('videoFontFamily');
        const fontPreview = document.getElementById('fontPreview');
        
        if (fontSelect && fontPreview) {
            const selectedFont = fontSelect.value || 'Uthmanic Hafs';
            
            // Map user-friendly names to actual system font names (same as server)
            const fontMapping = {
                'Uthmanic Hafs': 'UthmanicHafs1Ver18, KFGQPC HAFS Uthmanic Script, KFGQPC Uthmanic Script HAFS',
                'Al Mushaf': 'Al Majeed Quranic Font, Arabic Typesetting',
                'Utman Taha Naskh': 'KFGQPC Uthman Taha Naskh, Tahoma',
                'Uthmanic Hafs Old': 'KFGQPC Uthmanic Script HAFS, Traditional Arabic'
            };
            
            const systemFontNames = fontMapping[selectedFont] || selectedFont;
            fontPreview.style.fontFamily = `${systemFontNames}, Arial, sans-serif`;
            console.log('Updated font preview to:', selectedFont, '→', systemFontNames);
        }
    }

    // Update orientation preview
    function updateOrientationPreview() {
        const orientationSelect = document.getElementById('videoOrientation');
        const orientationPreview = document.getElementById('orientationPreview');
        const videoPreviewContainer = document.getElementById('videoPreviewContainer');
        
        if (orientationSelect && orientationPreview) {
            const selectedOrientation = orientationSelect.value || 'landscape';
            let previewText = '';
            let aspectRatio = '16/9'; // Default landscape
            
            switch (selectedOrientation) {
                case 'portrait':
                    previewText = currentLang === 'ar' ? 'عمودي - 1080x1920' : 'Portrait - 1080x1920';
                    aspectRatio = '9/16'; // Portrait
                    break;
                case 'square':
                    previewText = currentLang === 'ar' ? 'مربع - 1080x1080' : 'Square - 1080x1080';
                    aspectRatio = '1/1'; // Square
                    break;
                case 'landscape':
                default:
                    previewText = currentLang === 'ar' ? 'أفقي - 1920x1080' : 'Landscape - 1920x1080';
                    aspectRatio = '16/9'; // Landscape
                    break;
            }
            
            // Update preview text
            orientationPreview.textContent = previewText;
            
            // Update preview container aspect ratio
            if (videoPreviewContainer) {
                videoPreviewContainer.style.aspectRatio = aspectRatio;
                
                // Remove existing orientation classes
                videoPreviewContainer.classList.remove('orientation-landscape', 'orientation-portrait', 'orientation-square');
                
                // Add appropriate orientation class
                switch (selectedOrientation) {
                    case 'portrait':
                        videoPreviewContainer.classList.add('orientation-portrait');
                        break;
                    case 'square':
                        videoPreviewContainer.classList.add('orientation-square');
                        break;
                    case 'landscape':
                    default:
                        videoPreviewContainer.classList.add('orientation-landscape');
                        break;
                }
                
                console.log('Updated preview container aspect ratio to:', aspectRatio, 'with class:', `orientation-${selectedOrientation}`);
            }
            
            console.log('Updated orientation preview to:', selectedOrientation, previewText);
        }
    }

    // Load video backgrounds for video generation
    async function loadVideoBackgrounds() {
        try {
            const response = await fetch('https://adkar.zeabur.app/api/backgrounds');
            const backgrounds = await response.json();
            
            const backgroundGrid = document.getElementById('backgroundGrid');
            if (backgroundGrid) {
                backgroundGrid.innerHTML = '';
                
                backgrounds.forEach(background => {
                    const backgroundItem = document.createElement('div');
                    backgroundItem.className = 'relative cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-all duration-200 hover:border-purple-400 dark:hover:border-purple-500';
                    backgroundItem.setAttribute('data-background-type', background.type);
                    backgroundItem.setAttribute('data-background-filename', background.filename);
                    
                    backgroundItem.innerHTML = `
                        <div class="relative">
                            <img src="${background.thumbnailUrl}" alt="${background.displayName}" class="w-full h-32 object-cover">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <i class="fas fa-play text-white text-2xl opacity-80 bg-black bg-opacity-50 rounded-full p-3"></i>
                            </div>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-sm p-2 text-center">
                            ${background.displayName}
                        </div>
                    `;

                    backgroundItem.addEventListener('click', () => {
                        // Remove selected class from all backgrounds
                        document.querySelectorAll('#backgroundGrid > div').forEach(item => {
                            item.classList.remove('border-purple-500', 'dark:border-purple-400');
                            item.classList.add('border-gray-300', 'dark:border-gray-600');
                        });

                        // Add selected class to clicked background
                        backgroundItem.classList.remove('border-gray-300', 'dark:border-gray-600');
                        backgroundItem.classList.add('border-purple-500', 'dark:border-purple-400');

                        // Store selected background
                        selectedBackground = {
                            type: background.type,
                            filename: background.filename
                        };

                        console.log('Selected video background:', selectedBackground);
                        updateVideoPreview();
                    });

                    backgroundGrid.appendChild(backgroundItem);
                });

                // Auto-select first background if available
                if (backgrounds.length > 0) {
                    const firstItem = backgroundGrid.firstChild;
                    firstItem.classList.remove('border-gray-300', 'dark:border-gray-600');
                    firstItem.classList.add('border-purple-500', 'dark:border-purple-400');
                    selectedBackground = {
                        type: backgrounds[0].type,
                        filename: backgrounds[0].filename
                    };
                }
            }
        } catch (error) {
            console.error('Error loading backgrounds:', error);
            // Fallback to placeholder backgrounds if server is not available
            const fallbackBackgrounds = [
                { id: 'mosque_1', name: 'Beautiful Mosque', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' },
                { id: 'kaaba', name: 'Kaaba', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' },
                { id: 'medina', name: 'Medina', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' },
                { id: 'nature', name: 'Nature', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' },
                { id: 'geometric', name: 'Geometric Pattern', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' },
                { id: 'gradient', name: 'Gradient', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+' }
            ];
            
            const backgroundGrid = document.getElementById('backgroundGrid');
            if (backgroundGrid) {
                backgroundGrid.innerHTML = '';
                fallbackBackgrounds.forEach(background => {
                    const backgroundItem = document.createElement('div');
                    backgroundItem.className = 'aspect-square bg-cover bg-center rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 flex items-center justify-center';
                    backgroundItem.style.backgroundImage = `url(${background.url})`;
                    backgroundItem.setAttribute('data-background-id', background.id);
                    backgroundItem.setAttribute('title', background.name);
                    
                    // Add placeholder text
                    backgroundItem.innerHTML = `<span class="text-xs text-gray-600 dark:text-gray-400 text-center">${background.name}</span>`;
                    
                    backgroundItem.addEventListener('click', () => {
                        // Remove selected class from all backgrounds
                        document.querySelectorAll('#backgroundGrid > div').forEach(item => {
                            item.classList.remove('border-purple-500', 'dark:border-purple-400');
                            item.classList.add('border-gray-300', 'dark:border-gray-600');
                        });
                        
                        // Add selected class to clicked background
                        backgroundItem.classList.remove('border-gray-300', 'dark:border-gray-600');
                        backgroundItem.classList.add('border-purple-500', 'dark:border-purple-400');
                        
                        selectedBackground = background.id;
                        customBackgroundFile = null;
                        
                        updateVideoPreview();
                    });
                    
                    backgroundGrid.appendChild(backgroundItem);
                });
            }
        }
    }

    // Load surahs for video generation
    function loadVideoSurahs() {
        console.log('loadVideoSurahs: Starting...');
        console.log('loadVideoSurahs: Quran data available:', !!quranData);
        
        if (!quranData) {
            console.log('loadVideoSurahs: Quran data not available, attempting to load...');
            // If Quran data isn't loaded yet, try to load it
            loadQuranData().then(() => {
                console.log('loadVideoSurahs: Quran data loaded successfully, retrying...');
                loadVideoSurahs();
            }).catch(error => {
                console.error('loadVideoSurahs: Failed to load Quran data for video generator:', error);
            });
            return;
        }
        
        const surahSelect = document.getElementById('videoSurahSelect');
        console.log('loadVideoSurahs: Found surah select element:', !!surahSelect);
        if (surahSelect) {
            surahSelect.innerHTML = '<option value="">اختر السورة</option>';
            console.log('loadVideoSurahs: Quran data structure:', quranData);
            console.log('loadVideoSurahs: Number of surahs:', quranData.length);
            
            // quranData is already an array of surahs (extracted from data.surahs)
            quranData.forEach((surah, index) => {
                const option = document.createElement('option');
                option.value = index + 1;
                option.textContent = `${surah.number}. ${surah.name}`;
                surahSelect.appendChild(option);
            });
            console.log('loadVideoSurahs: Added', quranData.length, 'surahs to dropdown');
        } else {
            console.error('loadVideoSurahs: Surah select element not found!');
        }
    }

    // Setup video tabs
    function setupVideoTabs() {
        console.log('Setting up video tabs...');
        
        // Get all tab buttons and content
        const tabButtons = document.querySelectorAll('.video-tab-btn');
        const tabContents = document.querySelectorAll('.video-tab-content');
        
        console.log('Found tab buttons:', tabButtons.length);
        console.log('Found tab contents:', tabContents.length);
        
        // Add click event listeners to tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                console.log('Tab clicked:', targetTab);
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                    btn.classList.remove('text-purple-600', 'dark:text-purple-400', 'border-purple-500', 'bg-white/50', 'dark:bg-gray-800/50');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                button.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                button.classList.add('text-purple-600', 'dark:text-purple-400', 'border-purple-500', 'bg-white/50', 'dark:bg-gray-800/50');
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                // Show target tab content
                const targetContent = document.getElementById(targetTab + 'Tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.remove('hidden');
                    console.log('Showing tab:', targetTab);
                } else {
                    console.error('Tab content not found for:', targetTab);
                }
            });
        });
        
        // Set initial active tab (verse tab)
        const verseTab = document.querySelector('[data-tab="verse"]');
        const verseContent = document.getElementById('verseTab');
        
        if (verseTab && verseContent) {
            verseTab.classList.add('active');
            verseContent.classList.add('active');
            verseContent.classList.remove('hidden');
            console.log('Initial tab set to verse');
        }
    }

    // Setup video event listeners
    function setupVideoEventListeners() {
        // Add event listener for "To verse" dropdown
        const ayahToSelect = document.getElementById('videoAyahToSelect');
        if (ayahToSelect) {
            ayahToSelect.addEventListener('change', (e) => {
                selectedVideoAyahTo = e.target.value ? parseInt(e.target.value) : null;
                console.log('Ayah To selected:', selectedVideoAyahTo);
                updateVideoPreview();
            });
        }
        console.log('setupVideoEventListeners: Starting...');
        
        // Surah selection
        const surahSelect = document.getElementById('videoSurahSelect');
        console.log('setupVideoEventListeners: Found surah select:', !!surahSelect);
        if (surahSelect) {
            surahSelect.addEventListener('change', (e) => {
                console.log('setupVideoEventListeners: Surah selected:', e.target.value);
                selectedVideoSurah = parseInt(e.target.value);
                loadVideoAyahs(selectedVideoSurah);
                updateSelectedVerse();
            });
        }

        // Ayah selection
        const ayahSelect = document.getElementById('videoAyahSelect');
        console.log('setupVideoEventListeners: Found ayah select:', !!ayahSelect);
        if (ayahSelect) {
            ayahSelect.addEventListener('change', (e) => {
                console.log('setupVideoEventListeners: Ayah selected:', e.target.value);
                selectedVideoAyah = parseInt(e.target.value);
            selectedVideoAyahTo = null; // Reset range when changing start verse
            updateAyahToDropdown(); // Update the "to verse" options
                console.log('Current selections for preview:', {
                    surah: selectedVideoSurah,
                    ayah: selectedVideoAyah,
                    background: selectedBackground
                });
                updateSelectedVerse();
                updateVideoPreview();
            });
        }

        // Reciter selection
        const reciterSelect = document.getElementById('videoReciterSelect');
        console.log('setupVideoEventListeners: Found reciter select:', !!reciterSelect);
        if (reciterSelect) {
            reciterSelect.addEventListener('change', (e) => {
                console.log('setupVideoEventListeners: Reciter selected:', e.target.value);
                selectedVideoReciter = e.target.value;
            });
        }



        // Font size slider
        const fontSizeSlider = document.getElementById('videoFontSize');
        console.log('setupVideoEventListeners: Found font size slider:', !!fontSizeSlider);
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const fontSizeValue = document.getElementById('fontSizeValue');
                if (fontSizeValue) {
                    fontSizeValue.textContent = `${e.target.value}px`;
                }
                updateVideoPreview();
            });
        }

        // Text color picker
        const textColorPicker = document.getElementById('videoTextColor');
        console.log('setupVideoEventListeners: Found text color picker:', !!textColorPicker);
        if (textColorPicker) {
            textColorPicker.addEventListener('change', updateVideoPreview);
        }

        // Font family selector
        const fontFamilySelect = document.getElementById('videoFontFamily');
        console.log('setupVideoEventListeners: Found font family select:', !!fontFamilySelect);
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                console.log('setupVideoEventListeners: Font family selected:', e.target.value);
                updateFontPreview();
                updateVideoPreview();
            });
        }

        // Orientation selector
        const orientationSelect = document.getElementById('videoOrientation');
        console.log('setupVideoEventListeners: Found orientation select:', !!orientationSelect);
        if (orientationSelect) {
            orientationSelect.addEventListener('change', (e) => {
                console.log('setupVideoEventListeners: Orientation selected:', e.target.value);
                updateOrientationPreview();
                updateVideoPreview();
            });
        }

        // Preview audio button
        const previewAudioBtn = document.getElementById('previewAudioBtn');
        console.log('setupVideoEventListeners: Found preview audio button:', !!previewAudioBtn);
        if (previewAudioBtn) {
            previewAudioBtn.addEventListener('click', previewAudio);
        }

        // Generate video button
        const generateVideoBtn = document.getElementById('generateVideoBtn');
        console.log('setupVideoEventListeners: Found generate video button:', !!generateVideoBtn);
        if (generateVideoBtn) {
            generateVideoBtn.addEventListener('click', generateVideo);
        }

        // Download video button
        const downloadVideoBtn = document.getElementById('downloadVideoBtn');
        console.log('setupVideoEventListeners: Found download video button:', !!downloadVideoBtn);
        if (downloadVideoBtn) {
            downloadVideoBtn.addEventListener('click', downloadVideo);
        }

        // Share video button
        const shareVideoBtn = document.getElementById('shareVideoBtn');
        console.log('setupVideoEventListeners: Found share video button:', !!shareVideoBtn);
        if (shareVideoBtn) {
            shareVideoBtn.addEventListener('click', shareVideo);
        }
        
        console.log('setupVideoEventListeners: Completed');
    }

    // Load ayahs for selected surah
    // Function to update the "To verse" dropdown based on selected "From verse"
    function updateAyahToDropdown() {
        const ayahToSelect = document.getElementById('videoAyahToSelect');
        if (!ayahToSelect || !selectedVideoAyah || !selectedVideoSurah) return;
        
        // Clear existing options
        ayahToSelect.innerHTML = '<option value="">آية واحدة فقط</option>';
        
        // Get max verses for current surah
        const surah = quranData[selectedVideoSurah - 1];
        if (!surah) return;
        
        const maxVerse = Math.min(selectedVideoAyah + 2, surah.ayahs.length); // Max 3 verses total
        
        // Add options for up to 2 additional verses
        for (let i = selectedVideoAyah + 1; i <= maxVerse; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `الآية ${i}`;
            ayahToSelect.appendChild(option);
        }
    }

    function loadVideoAyahs(surahNumber) {
        if (!quranData || !surahNumber) return;
        
        const surah = quranData[surahNumber - 1];
        const ayahSelect = document.getElementById('videoAyahSelect');
        
        if (ayahSelect && surah) {
            ayahSelect.innerHTML = '<option value="">اختر الآية</option>';
            surah.ayahs.forEach((ayah, index) => {
                const option = document.createElement('option');
                option.value = index + 1;
                option.textContent = `آية ${ayah.numberInSurah}`;
                ayahSelect.appendChild(option);
            });
        }
    }

    // Update selected verse display
    function updateSelectedVerse() {
        if (!selectedVideoSurah || !selectedVideoAyah || !quranData || !translationData) {
            document.getElementById('selectedVerseText').textContent = 'اختر سورة وآية لعرض النص';
            document.getElementById('selectedVerseTranslation').textContent = 'Select a surah and ayah to display text';
            return;
        }

        const surah = quranData[selectedVideoSurah - 1];
        const ayah = surah.ayahs[selectedVideoAyah - 1];
        const translation = translationData[selectedVideoSurah - 1].ayahs[selectedVideoAyah - 1];

        // Handle verse ranges
        let arabicText = '';
        let translationText = '';
        
        const startVerse = selectedVideoAyah;
        const endVerse = selectedVideoAyahTo || selectedVideoAyah;
        
        for (let i = startVerse; i <= endVerse; i++) {
            const currentAyah = surah.ayahs[i - 1];
            const currentTranslation = translationData[selectedVideoSurah - 1].ayahs[i - 1];
            
            if (currentAyah && currentTranslation) {
                if (arabicText) arabicText += ' ';
                if (translationText) translationText += ' ';
                
                arabicText += currentAyah.text;
                translationText += currentTranslation.text;
            }
        }
        
        document.getElementById('selectedVerseText').textContent = arabicText;
        document.getElementById('selectedVerseTranslation').textContent = translationText;
        
        updateVideoPreview();
    }

    // Preview audio
    async function previewAudio() {
        if (!selectedVideoSurah || !selectedVideoAyah || !selectedVideoReciter) {
            showToast(currentLang === 'ar' ? 'يرجى اختيار السورة والآية والقارئ' : 'Please select surah, ayah, and reciter', 'warning');
            return;
        }

        try {
            const audioUrl = selectedVideoAyahTo 
            ? `https://adkar.zeabur.app/api/verse-audio-range/${selectedVideoSurah}/${selectedVideoAyah}/${selectedVideoAyahTo}/${selectedVideoReciter}`
            : `https://adkar.zeabur.app/api/verse-audio/${selectedVideoSurah}/${selectedVideoAyah}/${selectedVideoReciter}`;
        
        const response = await fetch(audioUrl);
            const data = await response.json();
            
            const audio = new Audio(data.audioUrl);
            audio.play();
            
            showToast(currentLang === 'ar' ? 'جاري تشغيل الصوت...' : 'Playing audio...', 'info');
        } catch (error) {
            console.error('Error playing audio:', error);
            showToast(currentLang === 'ar' ? 'فشل في تشغيل الصوت' : 'Failed to play audio', 'error');
        }
    }

    // Debounce function for preview generation
    let previewTimeout;
    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(previewTimeout);
                func(...args);
            };
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(later, wait);
        };
    }

    // Generate real-time video preview
    async function generateLivePreview() {
        const preview = document.getElementById('videoPreview');
        if (!preview) return;
        
        // Validate all required data before proceeding
        if (!selectedVideoSurah || !selectedVideoAyah || !selectedBackground) {
            console.log('Cannot generate preview - missing data:', {
                surah: selectedVideoSurah,
                ayah: selectedVideoAyah,
                background: selectedBackground
            });
            return;
        }

        // Show loading state
        preview.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-800 rounded-lg">
                <div class="text-center text-white">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Generating live preview...</p>
                </div>
            </div>
        `;

        try {
            // Validate required data
            if (!selectedVideoSurah || !selectedVideoAyah || !selectedBackground) {
                console.log('Missing required data for preview:', {
                    surah: selectedVideoSurah,
                    ayah: selectedVideoAyah,
                    background: selectedBackground
                });
                return;
            }

            const requestData = {
                surah: selectedVideoSurah.toString(),
                ayah: selectedVideoAyah.toString(),
                reciter: document.getElementById('videoReciter')?.value || 'alafasy',
                backgroundType: selectedBackground.type,
                backgroundFilename: selectedBackground.filename,
                textColor: document.getElementById('videoTextColor')?.value || '#ffffff',
                fontSize: document.getElementById('videoFontSize')?.value || 48,
                fontFamily: document.getElementById('videoFontFamily')?.value || 'Uthmanic Hafs',
                orientation: document.getElementById('videoOrientation')?.value || 'landscape'
            };

            console.log('Requesting live preview generation...');
            console.log('Preview request data:', requestData);
            
            const response = await fetch('https://adkar.zeabur.app/api/preview-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('Live preview generated:', result.previewUrl);
                
                // Show the actual generated video preview
                preview.innerHTML = `
                    <div class="relative w-full h-full rounded-lg overflow-hidden">
                        <video 
                            class="w-full h-full object-cover" 
                            autoplay 
                            muted 
                            loop 
                            playsinline
                            controls
                        >
                            <source src="${result.previewUrl}?t=${Date.now()}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            Live Preview
                        </div>
                    </div>
                `;
            } else {
                throw new Error(result.error || 'Preview generation failed');
            }
        } catch (error) {
            console.error('Live preview error:', error);
            
            // Show error message in preview
            preview.innerHTML = `
                <div class="flex items-center justify-center h-full bg-red-900/20 rounded-lg border border-red-500">
                    <div class="text-center text-red-400">
                        <i class="fas fa-exclamation-triangle text-4xl mb-2"></i>
                        <p>Preview generation failed</p>
                        <p class="text-sm mt-1">Using web preview fallback</p>
                    </div>
                </div>
            `;
            
            // Fallback to web-based preview after a delay
            setTimeout(() => {
                updateWebPreview();
            }, 2000);
        }
    }

    // Web-based preview (fallback)
    function updateWebPreview() {
        const preview = document.getElementById('videoPreview');
        if (!preview) return;

        if (!selectedVideoSurah || !selectedVideoAyah) {
            preview.innerHTML = `
                <div class="text-center text-gray-500 dark:text-gray-400">
                    <i class="fas fa-video text-4xl mb-2"></i>
                    <p id="previewText">معاينة الفيديو ستظهر هنا</p>
                </div>
            `;
            return;
        }

        const surah = quranData[selectedVideoSurah - 1];
        const ayah = surah.ayahs[selectedVideoAyah - 1];
        const translation = translationData[selectedVideoSurah - 1].ayahs[selectedVideoAyah - 1];
        
        const fontSize = document.getElementById('videoFontSize')?.value || 48;
        const textColor = document.getElementById('videoTextColor')?.value || '#ffffff';
        const fontFamily = document.getElementById('videoFontFamily')?.value || 'Uthmanic Hafs';
        
        // Map frontend font names to system font names (same as server)
        const fontMapping = {
            'Uthmanic Hafs': 'KFGQPC HAFS Uthmanic Script',
            'Al Mushaf': 'Al Majeed Quranic Font',
            'Utman Taha Naskh': 'KFGQPC Uthman Taha Naskh',
            'Uthmanic Hafs Old': 'KFGQPC Uthmanic Script HAFS'
        };
        
        // Get actual font name and fallback
        const actualFont = fontMapping[fontFamily] || fontFamily;
        const fallbackFont = fontFamily === 'Uthmanic Hafs' ? 'Traditional Arabic' : 
                           fontFamily === 'Al Mushaf' ? 'Arabic Typesetting' :
                           fontFamily === 'Utman Taha Naskh' ? 'Tahoma' : 'Segoe UI';
        
        // Calculate responsive font size for preview (scale down for smaller preview area)
        const previewWidth = preview.offsetWidth || 640;
        const videoWidth = 1920; // Actual video width
        const fontScale = previewWidth / videoWidth;
        const previewFontSize = Math.max(12, fontSize * fontScale);
        const previewTranslationSize = Math.max(10, Math.floor(fontSize * 0.6) * fontScale);
        
        console.log('Preview font info:', {
            selectedFont: fontFamily,
            actualFont: actualFont,
            fallbackFont: fallbackFont,
            originalSize: fontSize,
            previewSize: previewFontSize,
            scale: fontScale
        });

        // Create preview with video background if selected
        if (selectedBackground && selectedBackground.type === 'video') {
            preview.innerHTML = `
                <div class="relative w-full h-full rounded-lg overflow-hidden">
                    <video 
                        id="previewVideo"
                        class="absolute inset-0 w-full h-full object-cover" 
                        autoplay 
                        muted 
                        loop 
                        playsinline
                        onloadstart="console.log('Video loading started')"
                        oncanplay="console.log('Video can play')"
                        onerror="console.error('Video load error', event)"
                    >
                        <source src="/videos/${selectedBackground.filename}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="absolute inset-0 bg-black/30"></div>
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <div class="font-bold mb-4" style="color: ${textColor}; font-size: ${previewFontSize}px; font-family: '${actualFont}', '${fallbackFont}', Arial, sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.2;">${ayah.text}</div>
                        <div style="color: ${textColor}; font-size: ${previewTranslationSize}px; font-family: Arial, sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.4;">${translation.text}</div>
                    </div>
                </div>
            `;
            
            // Add error handling for video loading
            setTimeout(() => {
                const videoElement = document.getElementById('previewVideo');
                if (videoElement) {
                    videoElement.addEventListener('error', (e) => {
                        console.error('Video preview error:', e);
                        // Fallback to static background on video error
                        preview.innerHTML = `
                            <div class="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                <div class="text-center text-white">
                                    <i class="fas fa-video-slash text-4xl mb-2"></i>
                                    <p>Video preview unavailable</p>
                                    <p class="text-sm text-gray-300">Video will work in generated output</p>
                                </div>
                            </div>
                        `;
                    });
                }
            }, 100);
        } else {
            // Fallback for image backgrounds or no background
            preview.innerHTML = `
                <div class="relative w-full h-full bg-cover bg-center rounded-lg overflow-hidden" style="background-image: url(${selectedBackground && selectedBackground.type === 'image' ? `/img/backgrounds/${selectedBackground.filename}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+'});">
                    <div class="absolute inset-0 bg-black/30"></div>
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <div class="font-bold mb-4" style="color: ${textColor}; font-size: ${previewFontSize}px; font-family: '${actualFont}', '${fallbackFont}', Arial, sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.2;">${ayah.text}</div>
                        <div style="color: ${textColor}; font-size: ${previewTranslationSize}px; font-family: Arial, sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.4;">${translation.text}</div>
                    </div>
                </div>
            `;
        }
    }

    // Create debounced version of live preview (wait 500ms after user stops changing settings)
    const debouncedLivePreview = debounce(generateLivePreview, 500);

    // Function to update preview aspect ratio based on orientation
    function updatePreviewAspectRatio() {
        const preview = document.getElementById('videoPreview');
        const orientationSelect = document.getElementById('videoOrientation');
        
        if (preview && orientationSelect) {
            const orientation = orientationSelect.value || 'landscape';
            
            // Remove all aspect ratio classes
            preview.classList.remove('aspect-video', 'aspect-square', 'aspect-[9/16]');
            
            // Add appropriate aspect ratio class based on orientation
            switch (orientation) {
                case 'portrait':
                    preview.classList.add('aspect-[9/16]'); // 9:16 for portrait
                    break;
                case 'square':
                    preview.classList.add('aspect-square'); // 1:1 for square
                    break;
                case 'landscape':
                default:
                    preview.classList.add('aspect-video'); // 16:9 for landscape
                    break;
            }
        }
    }

    // Main update function - always use live preview for better accuracy
    function updateVideoPreview() {
        // Update preview aspect ratio first
        updatePreviewAspectRatio();
        
        if (selectedBackground && selectedVideoSurah && selectedVideoAyah) {
            // Generate live preview automatically (debounced)
            debouncedLivePreview();
        } else {
            // Show placeholder when missing selections
            const preview = document.getElementById('videoPreview');
            if (preview) {
                preview.innerHTML = `
                    <div class="text-center text-gray-500 dark:text-gray-400">
                        <i class="fas fa-video text-4xl mb-2"></i>
                        <p id="previewText">معاينة الفيديو ستظهر هنا</p>
                        <p class="text-sm mt-1">Select verse and background to see live preview</p>
                    </div>
                `;
            }
        }
    }

    // Generate video
    async function generateVideo() {
        console.log('generateVideo: Starting...');
        console.log('generateVideo: Selected surah:', selectedVideoSurah);
        console.log('generateVideo: Selected ayah:', selectedVideoAyah);
        console.log('generateVideo: Selected reciter:', selectedVideoReciter);
        
        if (!selectedVideoSurah || !selectedVideoAyah || !selectedVideoReciter) {
            console.log('generateVideo: Missing required selections');
            showToast(currentLang === 'ar' ? 'يرجى اختيار السورة والآية والقارئ' : 'Please select surah, ayah, and reciter', 'warning');
            return;
        }

        const generateBtn = document.getElementById('generateVideoBtn');
        const progressDiv = document.getElementById('generationProgress');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        console.log('generateVideo: Found UI elements:', {
            generateBtn: !!generateBtn,
            progressDiv: !!progressDiv,
            progressBar: !!progressBar,
            progressText: !!progressText
        });

        // Show progress
        generateBtn.style.display = 'none';
        progressDiv.classList.remove('hidden');

        try {
            console.log('generateVideo: Starting video generation process...');
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 90) progress = 90;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = currentLang === 'ar' ? 
                    `جاري إنشاء الفيديو... ${Math.floor(progress)}%` : 
                    `Generating video... ${Math.floor(progress)}%`;
            }, 500);

            // Prepare form data
            const formData = new FormData();
            formData.append('surah', selectedVideoSurah);
            formData.append('ayah', selectedVideoAyah);
        if (selectedVideoAyahTo) {
            formData.append('ayahTo', selectedVideoAyahTo);
        }
            formData.append('reciter', selectedVideoReciter);
            if (selectedBackground && selectedBackground.type && selectedBackground.filename) {
                formData.append('backgroundType', selectedBackground.type);
                formData.append('backgroundFilename', selectedBackground.filename);
            } else {
                formData.append('backgroundType', 'image');
                formData.append('backgroundFilename', 'mosque_1.jpg');
            }
            formData.append('textColor', document.getElementById('videoTextColor')?.value || '#ffffff');
            formData.append('fontSize', document.getElementById('videoFontSize')?.value || 48);
            const selectedFont = document.getElementById('videoFontFamily')?.value || 'Uthmanic Hafs';
        console.log('generateVideo: Selected font from dropdown:', selectedFont);
        formData.append('fontFamily', selectedFont);
            formData.append('orientation', document.getElementById('videoOrientation')?.value || 'landscape');



            console.log('generateVideo: Form data prepared, sending request to /api/generate-video...');
            console.log('generateVideo: selectedBackground:', selectedBackground);
            
            // Debug form data
            for (let [key, value] of formData.entries()) {
                console.log('FormData:', key, '=', value);
            }

            // Send request
            const response = await fetch('https://adkar.zeabur.app/api/generate-video', {
                method: 'POST',
                body: formData
            });

            console.log('generateVideo: Response received, status:', response.status);

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressText.textContent = currentLang === 'ar' ? 'تم إنشاء الفيديو!' : 'Video generated!';

            if (response.ok) {
                const result = await response.json();
                console.log('generateVideo: Video generated successfully:', result);
                
                // Store video info for download/share
                window.generatedVideoInfo = result;
                
                // Show results
                document.getElementById('videoResults').classList.remove('hidden');
                
                showToast(currentLang === 'ar' ? 'تم إنشاء الفيديو بنجاح!' : 'Video generated successfully!', 'success');
            } else {
                console.error('generateVideo: Server returned error status:', response.status);
                throw new Error('Failed to generate video');
            }

        } catch (error) {
            console.error('generateVideo: Error generating video:', error);
            
            // Check if it's a network error (server not running)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('generateVideo: Network error - server may not be running');
                showToast(currentLang === 'ar' ? 
                    'خادم الفيديو غير متصل. يرجى تشغيل الخادم أولاً.' : 
                    'Video server not connected. Please start the server first.', 'error');
            } else {
                showToast(currentLang === 'ar' ? 'فشل في إنشاء الفيديو' : 'Failed to generate video', 'error');
            }
        } finally {
            // Hide progress
            generateBtn.style.display = 'block';
            progressDiv.classList.add('hidden');
            progressBar.style.width = '0%';
        }
    }

    // Download video
    function downloadVideo() {
        if (!window.generatedVideoInfo) {
            showToast(currentLang === 'ar' ? 'لا يوجد فيديو للتحميل' : 'No video to download', 'warning');
            return;
        }

        const link = document.createElement('a');
        link.href = `https://adkar.zeabur.app${window.generatedVideoInfo.downloadUrl}`;
        link.download = `quran-verse-${window.generatedVideoInfo.videoId}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Share video
    function shareVideo() {
        if (!window.generatedVideoInfo) {
            showToast(currentLang === 'ar' ? 'لا يوجد فيديو للمشاركة' : 'No video to share', 'warning');
            return;
        }

        const shareUrl = `${window.location.origin}${window.generatedVideoInfo.shareUrl}`;
        
        if (navigator.share) {
            navigator.share({
                title: currentLang === 'ar' ? 'فيديو قرآن' : 'Quran Video',
                text: currentLang === 'ar' ? 'شاهد هذا الفيديو الجميل للقرآن' : 'Check out this beautiful Quran video',
                url: shareUrl
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast(currentLang === 'ar' ? 'تم نسخ رابط المشاركة' : 'Share link copied to clipboard', 'success');
            }).catch(() => {
                showToast(currentLang === 'ar' ? 'فشل في نسخ الرابط' : 'Failed to copy link', 'error');
            });
        }
    }

    // Update video language
    function updateVideoLanguage() {
        const elements = {
            // Main titles
            'videoGeneratorTitle': currentLang === 'ar' ? 'إنشاء فيديو القرآن' : 'Quran Video Generator',
            'videoGeneratorSubtitle': currentLang === 'ar' ? 'مولد فيديو القرآن' : 'Video Quran Generator',
            
            // Tab titles
            'verseTabTitle': currentLang === 'ar' ? 'الآية' : 'Verse',
            'audioTabTitle': currentLang === 'ar' ? 'الصوت' : 'Audio',
            'styleTabTitle': currentLang === 'ar' ? 'التصميم' : 'Style',
            'backgroundTabTitle': currentLang === 'ar' ? 'الخلفية' : 'Background',
            
            // Form labels
            'surahLabel': currentLang === 'ar' ? 'السورة' : 'Surah',
            'ayahFromLabel': currentLang === 'ar' ? 'من الآية' : 'From Verse',
            'ayahToLabel': currentLang === 'ar' ? 'إلى الآية' : 'To Verse',
            'reciterLabel': currentLang === 'ar' ? 'القارئ' : 'Reciter',
            'backgroundTitle': currentLang === 'ar' ? 'خلفية الفيديو' : 'Video Background',
            
            // Style settings
            'fontSettingsTitle': currentLang === 'ar' ? 'إعدادات الخط' : 'Font Settings',
            'videoSettingsTitle': currentLang === 'ar' ? 'إعدادات الفيديو' : 'Video Settings',
            'fontFamilyLabel': currentLang === 'ar' ? 'نوع الخط' : 'Font Family',
            'fontSizeLabel': currentLang === 'ar' ? 'حجم الخط' : 'Font Size',
            'textColorLabel': currentLang === 'ar' ? 'لون النص' : 'Text Color',
            'orientationLabel': currentLang === 'ar' ? 'الاتجاه' : 'Orientation',
            
            // Actions
            'previewTitle': currentLang === 'ar' ? 'معاينة الفيديو' : 'Video Preview',
            'generateButtonText': currentLang === 'ar' ? 'إنشاء الفيديو' : 'Generate Video',
            'downloadText': currentLang === 'ar' ? 'تحميل' : 'Download',
            'shareText': currentLang === 'ar' ? 'مشاركة' : 'Share',
            'successTitle': currentLang === 'ar' ? 'تم إنشاء الفيديو بنجاح!' : 'Video generated successfully!',
            'previewAudioText': currentLang === 'ar' ? 'استمع للآية' : 'Preview Audio'
        };

        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });

        // Update preview text
        const previewText = document.getElementById('previewText');
        if (previewText) {
            previewText.textContent = currentLang === 'ar' ? 'معاينة الفيديو ستظهر هنا' : 'Video preview will appear here';
        }

        // Update progress text
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = currentLang === 'ar' ? 'جاري إنشاء الفيديو...' : 'Generating video...';
        }

        // Update select placeholders
        const videoSurahSelect = document.getElementById('videoSurahSelect');
        if (videoSurahSelect && videoSurahSelect.options[0]) {
            videoSurahSelect.options[0].textContent = currentLang === 'ar' ? 'اختر السورة' : 'Select Surah';
        }

        const videoAyahSelect = document.getElementById('videoAyahSelect');
        if (videoAyahSelect && videoAyahSelect.options[0]) {
            videoAyahSelect.options[0].textContent = currentLang === 'ar' ? 'اختر الآية' : 'Select Verse';
        }

        const videoAyahToSelect = document.getElementById('videoAyahToSelect');
        if (videoAyahToSelect && videoAyahToSelect.options[0]) {
            videoAyahToSelect.options[0].textContent = currentLang === 'ar' ? 'آية واحدة' : 'Single Verse';
        }

        const videoReciterSelect = document.getElementById('videoReciterSelect');
        if (videoReciterSelect && videoReciterSelect.options[0]) {
            videoReciterSelect.options[0].textContent = currentLang === 'ar' ? 'اختر القارئ' : 'Select Reciter';
        }

        const videoFontFamily = document.getElementById('videoFontFamily');
        if (videoFontFamily && videoFontFamily.options[0]) {
            videoFontFamily.options[0].textContent = currentLang === 'ar' ? 'اختر نوع الخط' : 'Select Font';
        }

        // Update selected verse text placeholder
        const selectedVerseText = document.getElementById('selectedVerseText');
        if (selectedVerseText && selectedVerseText.textContent.includes('اختر سورة')) {
            selectedVerseText.textContent = currentLang === 'ar' ? 'اختر سورة وآية لعرض النص' : 'Select a surah and verse to display text';
        }

        const selectedVerseTranslation = document.getElementById('selectedVerseTranslation');
        if (selectedVerseTranslation && selectedVerseTranslation.textContent.includes('Select a surah')) {
            selectedVerseTranslation.textContent = currentLang === 'ar' ? 'اختر سورة وآية لعرض الترجمة' : 'Select a surah and verse to display translation';
        }

        // Update orientation select options
        const orientationSelect = document.getElementById('videoOrientation');
        if (orientationSelect) {
            Array.from(orientationSelect.options).forEach(option => {
                const arText = option.getAttribute('data-ar');
                const enText = option.getAttribute('data-en');
                if (arText && enText) {
                    option.textContent = currentLang === 'ar' ? arText : enText;
                }
            });
        }

        // Update orientation preview after language change
        updateOrientationPreview();
    }

    // Update main tab language
    function updateMainTabLanguage() {
        const tabElements = {
            'qiblaTab': currentLang === 'ar' ? 'القبلة' : 'Qibla',
            'adhkarTab': currentLang === 'ar' ? 'الأذكار' : 'Adhkar',
            'prayerTab': currentLang === 'ar' ? 'أوقات الصلاة' : 'Prayer Times',
            'quranTab': currentLang === 'ar' ? 'القرآن' : 'Quran',
            'videoTab': currentLang === 'ar' ? 'إنشاء الفيديو' : 'Shorts'
        };

        Object.entries(tabElements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
    }

    // Function to switch to Tasbih tab (called from Adhkar page)
    function switchToTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active class to the target content
        const targetContent = document.getElementById(`${tabId}Content`);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log('Activated content:', `${tabId}Content`);
        } else {
            console.error('Target content not found:', `${tabId}Content`);
        }

        // Handle special cases for specific tabs
        if (tabId === 'tasbih') {
            // Hide Quran controls when switching to Tasbih
            const controls = document.querySelector('.quran-controls-sticky');
            if (controls) {
                controls.style.display = 'none';
            }
        }
    }

