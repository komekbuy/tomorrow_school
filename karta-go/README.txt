КАРТА GO — инфо-лист на один лист
=================================

СТАТУС: не закончена, ждёт оценки Нурса. Референс — mind map в стиле
рукописных зинов (цветные пятна, чёрная рамка со смещением, волнистые
связи, каракули по полю).

ФАЙЛЫ
  karta-go.html            текущая версия (тёмная доска, mind map) — ИСХОДНИК
  Karta-Go.pdf             она же в PDF, A2 альбомный (594x420 мм)
  Karta-Go.png             она же картинкой
  versiya-2-svetlaya.html  отклонена: светлая, шесть колонок, «слишком строго»
  versiya-1-setka.html     отклонена: тёмная сетка одинаковых карточек, «квадратики»

КАК ПЕРЕСОБРАТЬ PDF И КАРТИНКУ
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$HOME/Downloads/Karta-Go.pdf" \
    --virtual-time-budget=14000 "file://$PWD/karta-go.html"

  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=3368,2381 \
    --screenshot="$HOME/Downloads/Karta-Go.png" \
    --virtual-time-budget=14000 "file://$PWD/karta-go.html"

ЧТО ЗАЛОЖЕНО В ДИЗАЙН
  - шесть цветовых областей = шесть областей языка, легенда в шапке
  - цветное пятно и рамка НЕ совпадают (сдвиг + поворот на градус) — отсюда «лёгкость»
  - шрифты Caveat (заголовки) и Neucha (текст) — оба с кириллицей
  - схемы вместо текста: байты строки «Привет», окно len/cap у слайса, указатель
  - каракули в тему Go: гофер, скобки, биты, терминал с рожицей

ЧТО ОСТАЛОСЬ ПО ЗАМЕЧАНИЯМ
  - оценка Нурса не получена
  - центр великоват, внутри пусто
  - слева под блоком «Строки и руны» осталась дыра
