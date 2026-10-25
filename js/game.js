"use strict";

// 遊戲內容集中在資料表中，加入新口味時不必改動主要判分流程。
const INGREDIENTS = {
  bases: [
    { id: "round", name: "圓形海綿", color: "#d9a06f", icon: "🍰", shape: "round" },
    { id: "square", name: "方形磅蛋糕", color: "#c98960", icon: "🍰", shape: "square" },
    { id: "chocolate", name: "巧克力蛋糕", color: "#805044", icon: "🍫", shape: "square" },
    { id: "heart", name: "愛心蛋糕", color: "#d99a88", icon: "💗", shape: "heart" },
    { id: "star", name: "星星蛋糕", color: "#d8a95e", icon: "⭐", shape: "star" },
    { id: "roll", name: "奶油蛋糕捲", color: "#d5a477", icon: "🍥", shape: "roll" },
    { id: "cupcake", name: "杯子蛋糕", color: "#c98960", icon: "🧁", shape: "cupcake" }
  ],
  creams: [
    { id: "pink", name: "草莓奶油", color: "#f3a5b4", icon: "🍓" },
    { id: "white", name: "香草奶油", color: "#fff7e8", icon: "🍦" },
    { id: "green", name: "薄荷奶油", color: "#a8d9b5", icon: "🌿" },
    { id: "chocolate", name: "巧克力奶油", color: "#8b5b48", icon: "🍫" },
    { id: "purple", name: "藍莓奶油", color: "#b8a4df", icon: "🫐" },
    { id: "lemon", name: "檸檬奶油", color: "#f4df83", icon: "🍋" },
    { id: "caramel", name: "焦糖奶油", color: "#d99b54", icon: "🍯" }
  ],
  toppings: [
    { id: "strawberry", name: "草莓", emoji: "🍓", color: "#e74455" },
    { id: "blueberry", name: "藍莓", emoji: "🫐", color: "#5875c8" },
    { id: "cherry", name: "櫻桃", emoji: "🍒", color: "#c72d4c" },
    { id: "grape", name: "葡萄", emoji: "🍇", color: "#8661bd" },
    { id: "orange", name: "橘子", emoji: "🍊", color: "#f39a3c" },
    { id: "kiwi", name: "奇異果", emoji: "🥝", color: "#80a94d" },
    { id: "peach", name: "水蜜桃", emoji: "🍑", color: "#f39b9b" },
    { id: "cookie", name: "巧克力餅乾", emoji: "🍪", color: "#a97858" }
  ]
};

// 顧客圖片依序對應使用者提供的素材；每張新訂單會換一位不同的客人。
const CUSTOMERS = [
  { id: "customer-01", image: "./assets/a.png.jpg" },
  { id: "customer-02", image: "./assets/e.png.jpg" },
  { id: "customer-03", image: "./assets/h.png.jpg" },
  { id: "customer-04", image: "./assets/j.png.jpg" },
  { id: "customer-05", image: "./assets/k.png.jpg" },
  { id: "customer-06", image: "./assets/n,png.jpg" },
  { id: "customer-07", image: "./assets/pig.png.jpg" },
  { id: "customer-08", image: "./assets/q.png.jpg" },
  { id: "customer-09", image: "./assets/qy.png.jpg" },
  { id: "customer-10", image: "./assets/u.png.jpg" },
  { id: "customer-11", image: "./assets/w.png.jpg" },
  { id: "customer-12", image: "./assets/o,png.jpg" }
];

const AVATARS = [
  ...CUSTOMERS,
  { id: "left-frame", image: "./assets/emo.png.jpg", unlockLevel: 50 },
  { id: "right-frame", image: "./assets/s.png.jpg", unlockLevel: 100 },
  { id: "avatar-laugh", image: "./assets/avatar-laugh.webp", purchaseCost: 300 },
  { id: "avatar-pink", image: "./assets/avatar-pink.webp", purchaseCost: 300 },
  { id: "avatar-success", image: "./assets/avatar-success.jpg", purchaseCost: 300 },
  {
    id: "avatar-tricycle",
    image: "./assets/835996759_935333869257991_8536188703495291097_n.jpg",
    permanentlyLocked: true
  },
  { id: "avatar-frog-tie", image: "./assets/images.jpg", purchaseCost: 300 }
];
const purchasableAvatarIds = AVATARS
  .filter((avatar) => avatar.purchaseCost)
  .map((avatar) => avatar.id);
const retiredAvatarIds = ["avatar-yellow", "avatar-tricycle"];
const savedAvatarIds = [...purchasableAvatarIds, ...retiredAvatarIds];

// 讀取畫面節點一次並保留參照，避免每次操作都重新查詢 DOM。
const canvas = document.querySelector("#cakeCanvas");
const ctx = canvas.getContext("2d");
const frogImage = new Image();
const wallPictures = [
  new Image(),
  new Image()
];
const orderHeading = document.querySelector("#orderHeading");
const orderText = document.querySelector("#orderText");
const orderList = document.querySelector("#orderList");
const message = document.querySelector("#message");
const levelNumber = document.querySelector("#levelNumber");
const levelExperience = document.querySelector("#levelExperience");
const levelTrack = document.querySelector("#levelTrack");
const levelProgress = document.querySelector("#levelProgress");
const levelTitle = document.querySelector("#levelTitle");
const coinBalance = document.querySelector("#coinBalance");
const outcomeDialog = document.querySelector("#outcomeDialog");
const outcomeTitle = document.querySelector("#outcomeTitle");
const outcomeImage = document.querySelector("#outcomeImage");
const outcomePlaceholder = document.querySelector("#outcomePlaceholder");
const outcomeDetail = document.querySelector("#outcomeDetail");
const outcomeStars = document.querySelector("#outcomeStars");
const outcomeRewards = document.querySelector("#outcomeRewards");
const outcomeExperience = document.querySelector("#outcomeExperience");
const outcomeCoins = document.querySelector("#outcomeCoins");
const coinBalanceText = document.querySelector("#coinBalanceText");
const progressStorageKey = "milk-frog-cake-shop-progress";
const nicknameStorageKey = "milk-frog-cake-shop-nickname";
const nicknameDialog = document.querySelector("#nicknameDialog");
const nicknameForm = document.querySelector("#nicknameForm");
const nicknameInput = document.querySelector("#nicknameInput");
const nicknameError = document.querySelector("#nicknameError");
const nicknameTitle = document.querySelector("#nicknameTitle");
const nicknameDescription = document.querySelector("#nicknameDescription");
const nicknameCost = document.querySelector("#nicknameCost");
const nicknameSubmitButton = nicknameForm.querySelector('[type="submit"]');
const playerNickname = document.querySelector("#playerNickname");
const avatarSwitch = document.querySelector("#avatarSwitch");
const playerAvatar = document.querySelector("#playerAvatar");
const avatarDialog = document.querySelector("#avatarDialog");
const avatarOptions = document.querySelector("#avatarOptions");
const avatarConfirmDialog = document.querySelector("#avatarConfirmDialog");
const avatarConfirmText = document.querySelector("#avatarConfirmText");
const levelProgressDialog = document.querySelector("#levelProgressDialog");
const levelUnlockProgress = document.querySelector("#levelUnlockProgress");
let pendingAvatarPurchase = null;

function loadNickname() {
  try {
    return localStorage.getItem(nicknameStorageKey)?.trim() ?? "";
  } catch (error) {
    console.error("讀取玩家暱稱失敗：", error);
    return "";
  }
}

function loadAvatarIndex() {
  try {
    const savedIndex = Number.parseInt(localStorage.getItem("milk-frog-cake-shop-avatar") ?? "0", 10);
    if (!Number.isInteger(savedIndex) || savedIndex < 0 || savedIndex > AVATARS.length) return 0;
    if (savedIndex === 14) return 0;
    return savedIndex > 14 ? savedIndex - 1 : savedIndex;
  } catch (error) {
    console.error("讀取玩家頭像失敗：", error);
    return 0;
  }
}

// state 是本局唯一的遊戲狀態來源；畫面由它重新繪製，避免 DOM 與 Canvas 資料不同步。
function loadSavedProgress() {
  try {
    const savedProgress = localStorage.getItem(progressStorageKey);
    if (savedProgress === null) {
      return { totalExperience: 0, totalCoins: 0, purchasedAvatarIds: [] };
    }

    const parsedProgress = JSON.parse(savedProgress);
    if (!Number.isSafeInteger(parsedProgress.totalExperience) || parsedProgress.totalExperience < 0) {
      throw new Error("存檔中的經驗值格式無效");
    }
    const totalCoins = parsedProgress.totalCoins ?? 0;
    if (!Number.isSafeInteger(totalCoins) || totalCoins < 0) {
      throw new Error("存檔中的金幣格式無效");
    }
    const purchasedAvatarIds = parsedProgress.purchasedAvatarIds ?? [];
    if (
      !Array.isArray(purchasedAvatarIds) ||
      purchasedAvatarIds.some((id) => !savedAvatarIds.includes(id))
    ) {
      throw new Error("存檔中的已購買頭像格式無效");
    }
    return {
      totalExperience: parsedProgress.totalExperience,
      totalCoins,
      purchasedAvatarIds
    };
  } catch (error) {
    console.error("讀取等級進度失敗：", error);
    message.textContent = "無法讀取玩家進度存檔，本次遊戲會從等級 1 和 0 金幣開始。";
    return { totalExperience: 0, totalCoins: 0, purchasedAvatarIds: [] };
  }
}

const savedProgress = loadSavedProgress();

const state = {
  order: null,
  customer: null,
  orders: [],
  availableChoices: { base: [], cream: [], topping: [] },
  nextOrderId: 1,
  cake: { base: null, cream: null, topping: null },
  totalExperience: savedProgress.totalExperience,
  totalCoins: savedProgress.totalCoins,
  purchasedAvatarIds: savedProgress.purchasedAvatarIds,
  nickname: loadNickname(),
  avatarIndex: loadAvatarIndex(),
  level: 1,
  experience: 0,
  experienceToNext: 100,
  activeStep: 0,
  orderStartedAt: null,
};

// 50 等以前每五等提升一次頭銜，之後每十等提升一次。
function updateLevelDisplay() {
  let remainingExperience = state.totalExperience;
  let level = 1;
  let experienceToNext = 100;

  while (remainingExperience >= experienceToNext) {
    remainingExperience -= experienceToNext;
    level += 1;
    experienceToNext = 100 + (level - 1) * 50;
  }

  state.level = level;
  state.experience = remainingExperience;
  state.experienceToNext = experienceToNext;

  const titles = [
    "新手奶蛙烘焙師",
    "見習奶蛙甜點師",
    "甜點奶蛙學徒",
    "正式奶蛙糕點師",
    "資深奶蛙烘焙師",
    "甜點奶蛙大師",
    "烘焙奶蛙宗師",
    "蛋糕奶蛙王者",
    "奶蛙傳奇",
    "甜點宇宙奶蛙至尊",
    "奶蛙星際烘焙師",
    "宇宙甜點創世主",
    "全能奶蛙烘焙神",
    "甜點次元守護者",
    "奶蛙甜點永恆傳說"
  ];
  const titleIndex = level <= 50
    ? Math.floor((level - 1) / 5)
    : 10 + Math.floor((level - 51) / 10);
  const title = titles[Math.min(titleIndex, titles.length - 1)];
  const selectedAvatar = AVATARS[state.avatarIndex];
  const selectedAvatarIsPurchased =
    selectedAvatar.purchaseCost && state.purchasedAvatarIds.includes(selectedAvatar.id);
  if (
    (selectedAvatar.unlockLevel && level < selectedAvatar.unlockLevel && !selectedAvatarIsPurchased) ||
    (selectedAvatar.purchaseCost && !state.purchasedAvatarIds.includes(selectedAvatar.id))
  ) {
    state.avatarIndex = 0;
  }
  levelNumber.textContent = `等級 ${level}`;
  levelExperience.textContent = `${remainingExperience} / ${experienceToNext} XP`;
  levelTitle.textContent = title;
  coinBalanceText.textContent = `金幣：${state.totalCoins}`;
  playerNickname.textContent = state.nickname || "未設定暱稱";
  const avatar = AVATARS[state.avatarIndex];
  playerAvatar.src = avatar.image;
  playerAvatar.alt = `${state.nickname || "玩家"}的頭像`;
  avatarSwitch.setAttribute("aria-label", `切換玩家頭像，目前為第 ${state.avatarIndex + 1} 張`);
  levelProgress.style.width = `${(remainingExperience / experienceToNext) * 100}%`;
  levelTrack.setAttribute("aria-valuemax", String(experienceToNext));
  levelTrack.setAttribute("aria-valuenow", String(remainingExperience));
}

function awardExperience(amount, coinAmount) {
  const previousLevel = state.level;
  state.totalExperience += amount;
  state.totalCoins += coinAmount;
  updateLevelDisplay();
  let saved = true;

  try {
    localStorage.setItem(
      progressStorageKey,
      JSON.stringify({
        totalExperience: state.totalExperience,
        totalCoins: state.totalCoins,
        purchasedAvatarIds: state.purchasedAvatarIds
      })
    );
  } catch (error) {
    console.error("保存等級與金幣進度失敗：", error);
    saved = false;
  }

  return { amount, coinAmount, leveledUp: state.level > previousLevel, saved };
}

function getStarRating(elapsedMilliseconds) {
  if (elapsedMilliseconds <= 5000) return 5;
  if (elapsedMilliseconds <= 8000) return 4;
  if (elapsedMilliseconds <= 13000) return 3;
  if (elapsedMilliseconds <= 16000) return 2;
  if (elapsedMilliseconds <= 20000) return 1;
  return 0;
}

function updateTimerDisplay() {
  if (state.orderStartedAt === null) {
    document.querySelector("#timerDisplay").textContent = "0.0";
    document.querySelector("#timerRating").textContent = "計時星等：尚未開始";
    document.querySelector("#timerRating").setAttribute("aria-label", "計時尚未開始");
    return;
  }

  const elapsedMilliseconds = Date.now() - state.orderStartedAt;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  const stars = getStarRating(elapsedMilliseconds);
  document.querySelector("#timerDisplay").textContent = elapsedSeconds.toFixed(1);
  document.querySelector("#timerRating").textContent =
    `計時星等：${"★".repeat(stars)}${"☆".repeat(5 - stars)}`;
  document.querySelector("#timerRating").setAttribute(
    "aria-label",
    `目前計時星等：${stars} 顆星`
  );
}

function showOutcome({ success, elapsedSeconds, starDisplay, starRating, experience, coins }) {
  outcomeDialog.classList.toggle("is-failure", !success);
  outcomeTitle.textContent = success ? "製作成功！" : "製作失敗";
  outcomeDetail.textContent = success
    ? `太棒了！蛋糕準時完成，獲得 ${elapsedSeconds.toFixed(1)} 秒的好成績。`
    : "蛋糕和訂單不符，這次沒有獲得經驗值。";
  outcomeStars.textContent = `${starDisplay}（${starRating} 顆星）`;
  outcomeStars.setAttribute("aria-label", `${starRating} 顆星`);
  outcomeExperience.textContent = `✨ 經驗值 +${experience} XP`;
  outcomeCoins.textContent = `+${coins}`;
  outcomeImage.hidden = true;
  outcomeImage.onload = null;
  outcomeImage.onerror = null;
  outcomeImage.removeAttribute("src");
  outcomePlaceholder.hidden = false;
  outcomePlaceholder.textContent = success ? "🐸✨" : "🐸😞";
  outcomeImage.alt = success ? "奶蛙" : "製作失敗時的哭泣角色";
  outcomeImage.onload = () => {
    outcomeImage.hidden = false;
    outcomePlaceholder.hidden = true;
  };
  outcomeImage.onerror = () => {
    outcomeImage.hidden = true;
    outcomePlaceholder.hidden = false;
  };
  outcomeImage.src = success ? "./assets/success.jpg" : "./assets/failure.jpg";
  outcomeDialog.showModal();
  document.querySelector("#outcomeClose").focus();
}

/**
 * 從指定資料表中隨機取得一種食材。
 * @param {Array<object>} items 食材選項
 * @returns {object} 抽中的食材
 */
function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickThreeChoices(items, requiredItem) {
  const alternatives = items.filter((item) => item.id !== requiredItem.id);
  const choices = [requiredItem];
  while (choices.length < Math.min(3, items.length)) {
    const nextIndex = Math.floor(Math.random() * alternatives.length);
    choices.push(alternatives.splice(nextIndex, 1)[0]);
  }
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[swapIndex]] = [choices[swapIndex], choices[index]];
  }
  return choices;
}

function renderIngredientOptions(category, options) {
  const container = document.querySelector(`#${category}Options`);
  container.replaceChildren(...options.map((ingredient) => {
    const button = document.createElement("button");
    button.className = "ingredient-button";
    button.type = "button";
    button.dataset.category = category;
    button.dataset.ingredient = ingredient.id;
    button.setAttribute("aria-pressed", String(state.cake[category]?.id === ingredient.id));

    const label = document.createElement("span");
    label.textContent = category === "base"
      ? ingredient.name.replace("蛋糕", "")
      : ingredient.name.replace("奶油", "");
    button.append(label);
    return button;
  }));
}

// 訂單先放入候單佇列，讓玩家可以預先看到後續客人的需求。
function createOrder() {
  const previousOrder = state.orders[state.orders.length - 1];
  const availableCustomers = previousOrder
    ? CUSTOMERS.filter((customer) => customer.id !== previousOrder.customer.id)
    : CUSTOMERS;
  const recipe = {
    base: pickRandom(INGREDIENTS.bases),
    cream: pickRandom(INGREDIENTS.creams),
    topping: pickRandom(INGREDIENTS.toppings)
  };
  return {
    id: state.nextOrderId++,
    customer: pickRandom(availableCustomers),
    recipe,
    choices: {
      base: pickThreeChoices(INGREDIENTS.bases, recipe.base),
      cream: pickThreeChoices(INGREDIENTS.creams, recipe.cream),
      topping: pickThreeChoices(INGREDIENTS.toppings, recipe.topping)
    }
  };
}

function renderOrders() {
  const currentOrder = state.orders[0];
  if (!currentOrder) {
    state.order = null;
    state.customer = null;
    orderHeading.textContent = "目前沒有待製作訂單";
    orderText.textContent = "正在準備新訂單……";
    orderList.replaceChildren();
    return;
  }

  state.order = currentOrder.recipe;
  state.customer = currentOrder.customer;
  state.availableChoices = currentOrder.choices;
  renderIngredientOptions("base", state.availableChoices.base);
  renderIngredientOptions("cream", state.availableChoices.cream);
  renderIngredientOptions("topping", state.availableChoices.topping);
  orderHeading.textContent = `${state.orders.length} 張待製作訂單`;
  orderText.textContent = "每種材料會隨訂單隨機提供 3 種選擇。";
  orderList.replaceChildren(...state.orders.map((order, index) => {
    const ticket = document.createElement("article");
    ticket.className = `order-ticket${index === 0 ? " is-current" : ""}`;
    ticket.setAttribute("role", "listitem");

    const details = document.createElement("div");
    details.className = "ticket-details";

    const customerImage = document.createElement("img");
    customerImage.className = "customer";
    customerImage.src = order.customer.image;
    customerImage.alt = "顧客圖片";
    customerImage.decoding = "async";

    const heading = document.createElement("div");
    heading.className = "ticket-heading";
    const status = document.createElement("span");
    status.className = "ticket-status";
    status.textContent = index === 0 ? "製作中" : "等候中";
    heading.append(status);

    const recipe = document.createElement("p");
    recipe.className = "ticket-recipe";
    recipe.textContent =
      `${order.recipe.base.name} + ${order.recipe.cream.name} + ${order.recipe.topping.name}`;

    details.append(heading, recipe);
    ticket.append(customerImage, details);
    return ticket;
  }));
}

/**
 * 依照 CSS 顯示尺寸調整 Canvas 的實際像素尺寸，避免高 DPI 螢幕繪圖模糊。
 * 繪圖座標使用固定的 720 × 310 邏輯尺寸，讓主要操作區能完整放進視窗。
 */
function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const logicalWidth = 720;
  const logicalHeight = 310;
  canvas.width = logicalWidth * pixelRatio;
  canvas.height = logicalHeight * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawCake();
}

// 兩側放低玻璃展示櫃，中央以木櫃台收邊，讓奶蛙完整露出櫃台上方。
function drawWorkshop(width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f6e4d2";
  ctx.fillRect(0, 0, width, height);

  // 淡色牆面。
  ctx.strokeStyle = "rgba(184, 133, 108, .13)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 230);
    ctx.stroke();
  }
  for (let y = 0; y <= 230; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 左側窗戶。
  ctx.fillStyle = "#c6e8e8";
  ctx.beginPath();
  ctx.roundRect(28, 20, 145, 86, 10);
  ctx.fill();
  ctx.strokeStyle = "#fff8ef";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.8)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, 24);
  ctx.lineTo(100, 102);
  ctx.moveTo(33, 62);
  ctx.lineTo(168, 62);
  ctx.stroke();
  ctx.fillStyle = "#f7d998";
  ctx.beginPath();
  ctx.arc(143, 40, 11, 0, Math.PI * 2);
  ctx.fill();

  function drawFramedPicture(image, x, y, width, height) {
    ctx.save();
    ctx.shadowColor = "rgba(83, 55, 42, .28)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#8d5b3e";
    ctx.fillRect(x, y, width, height);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#efcb88";
    ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
    ctx.fillStyle = "#fff8e9";
    ctx.fillRect(x + 7, y + 7, width - 14, height - 14);
    const imageX = x + 10;
    const imageY = y + 10;
    const imageWidth = width - 20;
    const imageHeight = height - 20;
    if (image.complete && image.naturalWidth > 0) {
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = imageWidth / imageHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;
      if (sourceRatio > targetRatio) {
        sourceWidth = image.naturalHeight * targetRatio;
        sourceX = (image.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = image.naturalWidth / targetRatio;
        sourceY = (image.naturalHeight - sourceHeight) / 2;
      }
      ctx.drawImage(
        image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        imageX, imageY, imageWidth, imageHeight
      );
    } else {
      ctx.fillStyle = "#ead9c8";
      ctx.fillRect(imageX, imageY, imageWidth, imageHeight);
    }
    ctx.restore();
  }

  drawFramedPicture(wallPictures[0], 178, 111, 64, 82);
  drawFramedPicture(wallPictures[1], 478, 111, 64, 82);

  // 兩側低矮玻璃櫃，展示蛋糕避開中央主角。
  function drawSideDisplay(x, frosting, fruit) {
    ctx.fillStyle = "#a97858";
    ctx.fillRect(x, 218, 132, 20);
    ctx.fillStyle = "#e5c49f";
    ctx.fillRect(x + 5, 174, 122, 44);
    ctx.fillStyle = "rgba(216, 242, 240, .68)";
    ctx.beginPath();
    ctx.roundRect(x + 4, 169, 124, 48, 8);
    ctx.fill();
    ctx.fillStyle = "#d29a68";
    ctx.beginPath();
    ctx.roundRect(x + 18, 194, 40, 19, 7);
    ctx.roundRect(x + 73, 194, 40, 19, 7);
    ctx.fill();
    ctx.fillStyle = frosting;
    ctx.beginPath();
    ctx.roundRect(x + 16, 189, 44, 12, 6);
    ctx.roundRect(x + 71, 189, 44, 12, 6);
    ctx.fill();
    ctx.font = '15px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fruit, x + 38, 187);
    ctx.fillText("🍰", x + 93, 187);
    ctx.strokeStyle = "#fff8ef";
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 3, 168, 126, 51);
  }
  drawSideDisplay(17, "#f3a5b4", "🍓");
  drawSideDisplay(571, "#fff2d7", "🍒");

  // 奶蛙位於櫃台後方，身體下緣剛好貼著木檯面。
  if (frogImage.complete && frogImage.naturalWidth > 0) {
    ctx.drawImage(frogImage, 266, 0, 188, 238);
  }

  // 中央木檯面和正面木板。
  ctx.fillStyle = "#d29a72";
  ctx.fillRect(0, 238, width, 11);
  ctx.fillStyle = "#b97e5c";
  ctx.fillRect(0, 249, width, 61);
  ctx.fillStyle = "rgba(255,255,255,.2)";
  ctx.fillRect(0, 249, width, 4);
  ctx.fillStyle = "rgba(110, 66, 48, .15)";
  for (let x = 24; x < width; x += 92) {
    ctx.fillRect(x, 263, 2, 47);
  }
  ctx.strokeStyle = "rgba(255, 224, 168, .72)";
  ctx.lineWidth = 2;
  [20, 526].forEach((x) => {
    ctx.beginPath();
    ctx.roundRect(x, 260, 174, 42, 9);
    ctx.stroke();
    ctx.strokeStyle = "rgba(110, 66, 48, .22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 4, 264, 166, 34, 6);
    ctx.stroke();
    ctx.fillStyle = "#f1ce8a";
    [x + 12, x + 162].forEach((knobX) => {
      ctx.beginPath();
      ctx.arc(knobX, 281, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = "rgba(255, 224, 168, .72)";
    ctx.lineWidth = 2;
  });

  // 櫃台中央的花形徽章與兩側抽屜飾紋。
  ctx.fillStyle = "#f3d89e";
  ctx.beginPath();
  ctx.arc(360, 280, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b97e5c";
  for (let petal = 0; petal < 5; petal += 1) {
    const angle = -Math.PI / 2 + petal * Math.PI * 2 / 5;
    ctx.beginPath();
    ctx.arc(360 + Math.cos(angle) * 6, 280 + Math.sin(angle) * 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#e5b978";
  [54, 78, 136, 160, 560, 584, 642, 666].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 281, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 中央檯面上的展示盤與玩家正在製作的蛋糕。
  ctx.fillStyle = "rgba(92, 57, 43, .16)";
  ctx.beginPath();
  ctx.ellipse(360, 240, 90, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffaf2";
  ctx.beginPath();
  ctx.ellipse(360, 234, 88, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d9c7b2";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function traceCakeShape(shape, x, y, width, height) {
  ctx.beginPath();
  if (shape === "round") {
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  } else if (shape === "heart") {
    ctx.moveTo(x + width / 2, y + height);
    ctx.bezierCurveTo(x + width * .1, y + height * .64, x - width * .02, y + height * .32, x + width * .25, y + height * .18);
    ctx.bezierCurveTo(x + width * .4, y + height * .08, x + width * .48, y + height * .2, x + width / 2, y + height * .3);
    ctx.bezierCurveTo(x + width * .62, y + height * .08, x + width * .82, y + height * .08, x + width * .94, y + height * .29);
    ctx.bezierCurveTo(x + width * 1.12, y + height * .62, x + width * .82, y + height * .83, x + width / 2, y + height);
  } else if (shape === "star") {
    for (let point = 0; point < 10; point += 1) {
      const angle = -Math.PI / 2 + point * Math.PI / 5;
      const radius = point % 2 === 0 ? width * .5 : width * .39;
      const pointX = x + width / 2 + Math.cos(angle) * radius;
      const pointY = y + height / 2 + Math.sin(angle) * radius * (height / width);
      if (point === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
  } else if (shape === "cupcake") {
    ctx.moveTo(x + width * .12, y + height * .1);
    ctx.lineTo(x + width * .88, y + height * .1);
    ctx.lineTo(x + width * .76, y + height);
    ctx.lineTo(x + width * .24, y + height);
    ctx.closePath();
  } else {
    ctx.roundRect(x, y, width, height, shape === "roll" ? height / 2 : 10);
  }
}

// 依蛋糕款式繪製不同輪廓，蛋糕盤維持一致以便清楚呈現造型。
function drawCakeBase(base) {
  const x = 296;
  const y = 174;
  const width = 128;
  const height = 56;

  // 瓷盤的陰影、盤面和雙層盤緣，讓蛋糕看起來放在櫃台上的盤子裡。
  ctx.fillStyle = "rgba(92, 57, 43, .2)";
  ctx.beginPath();
  ctx.ellipse(360, 240, 90, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffaf2";
  ctx.beginPath();
  ctx.ellipse(360, 234, 88, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d9c7b2";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(360, 232, 80, 5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,.95)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = base.color;
  traceCakeShape(base.shape, x, y, width, height);
  ctx.fill();
  ctx.save();
  traceCakeShape(base.shape, x, y, width, height);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,.17)";
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 6, width - 20, 10, 6);
  ctx.fill();
  ctx.restore();

  if (base.shape === "roll") {
    ctx.strokeStyle = "rgba(111, 67, 48, .55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 22, y + height / 2, 13, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 22, y + height / 2, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function traceCreamCap(base) {
  if (base.shape === "cupcake") {
    ctx.beginPath();
    ctx.moveTo(302, 179);
    ctx.bezierCurveTo(294, 163, 305, 154, 317, 158);
    ctx.bezierCurveTo(323, 143, 343, 143, 350, 154);
    ctx.bezierCurveTo(363, 139, 386, 147, 387, 160);
    ctx.bezierCurveTo(402, 153, 414, 163, 418, 179);
    ctx.closePath();
  } else if (base.shape === "roll") {
    ctx.beginPath();
    ctx.ellipse(360, 174, 72, 20, 0, 0, Math.PI * 2);
  } else {
    traceCakeShape(base.shape, 289, 158, 142, 40);
  }
}

function drawCream(cream, base) {
  ctx.fillStyle = cream.color;
  traceCreamCap(base);
  ctx.fill();

  if (base.shape === "round") {
    ctx.beginPath();
    ctx.roundRect(296, 180, 128, 20, 8);
    ctx.fill();
    for (let x = 306; x <= 414; x += 22) {
      ctx.beginPath();
      ctx.arc(x, 199, 7, 0, Math.PI);
      ctx.fill();
    }
  } else if (base.shape === "square") {
    ctx.beginPath();
    ctx.roundRect(296, 178, 128, 22, 4);
    ctx.fill();
    [[310, 196, 8], [346, 198, 13], [384, 196, 9], [410, 198, 6]].forEach(([x, y, length]) => {
      ctx.beginPath();
      ctx.roundRect(x - 5, y, 10, length, 5);
      ctx.fill();
    });
  } else if (base.shape === "heart") {
    ctx.fillStyle = cream.color;
    traceCakeShape("heart", 297, 171, 126, 46);
    ctx.fill();
    [[313, 173], [331, 162], [350, 167], [369, 162], [389, 173], [350, 193]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (base.shape === "star") {
    [[360, 159], [397, 174], [382, 195], [338, 195], [323, 174]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.beginPath();
    ctx.roundRect(310, 184, 100, 12, 6);
    ctx.fill();
  } else if (base.shape === "roll") {
    ctx.beginPath();
    ctx.roundRect(298, 180, 124, 9, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.72)";
    ctx.beginPath();
    ctx.arc(319, 174, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = cream.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(319, 174, 5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (base.shape === "cupcake") {
    ctx.beginPath();
    ctx.arc(350, 156, 12, Math.PI, Math.PI * 2);
    ctx.arc(365, 153, 12, Math.PI, Math.PI * 2);
    ctx.arc(380, 158, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(350, 151);
    ctx.bezierCurveTo(333, 146, 346, 133, 358, 143);
    ctx.bezierCurveTo(365, 128, 383, 136, 375, 149);
    ctx.closePath();
    ctx.fill();
  }

  ctx.save();
  traceCreamCap(base);
  ctx.clip();
  ctx.lineWidth = 2;
  if (cream.id === "pink") {
    ctx.fillStyle = "rgba(210, 75, 112, .55)";
    [[316, 169], [347, 176], [381, 166], [401, 180]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (cream.id === "white") {
    ctx.fillStyle = "rgba(164, 124, 82, .55)";
    [[315, 171], [333, 162], [357, 177], [378, 166], [399, 175]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (cream.id === "green") {
    ctx.strokeStyle = "rgba(58, 126, 83, .68)";
    [[315, 177], [341, 165], [369, 177], [397, 165]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(x - 5, y + 3);
      ctx.quadraticCurveTo(x, y - 7, x + 6, y - 5);
      ctx.quadraticCurveTo(x + 4, y + 3, x - 5, y + 3);
      ctx.stroke();
    });
  } else if (cream.id === "chocolate") {
    ctx.strokeStyle = "rgba(255, 224, 183, .8)";
    ctx.lineWidth = 3;
    for (let x = 280; x < 450; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 198);
      ctx.lineTo(x + 38, 150);
      ctx.stroke();
    }
  } else if (cream.id === "purple") {
    ctx.fillStyle = "rgba(91, 65, 153, .64)";
    [[313, 170], [332, 180], [350, 163], [371, 178], [393, 166], [407, 180]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (cream.id === "lemon") {
    ctx.strokeStyle = "rgba(222, 156, 44, .72)";
    ctx.lineWidth = 2;
    [[315, 169], [340, 179], [366, 165], [394, 176]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, .2, Math.PI * 1.7);
      ctx.stroke();
    });
  } else if (cream.id === "caramel") {
    ctx.strokeStyle = "rgba(133, 78, 38, .78)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(290, 169);
    ctx.bezierCurveTo(315, 184, 323, 157, 348, 172);
    ctx.bezierCurveTo(371, 186, 383, 157, 431, 172);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(298, 181);
    ctx.bezierCurveTo(325, 164, 341, 190, 363, 178);
    ctx.bezierCurveTo(389, 163, 403, 189, 427, 176);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBlueberry(x, y, size) {
  const gradient = ctx.createRadialGradient(
    x - size * .3, y - size * .35, 1,
    x, y, size
  );
  gradient.addColorStop(0, "#c5d2ff");
  gradient.addColorStop(.32, "#8299e7");
  gradient.addColorStop(.72, "#5875c8");
  gradient.addColorStop(1, "#354982");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.72)";
  ctx.lineWidth = Math.max(1, size * .1);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.86)";
  ctx.beginPath();
  ctx.arc(x - size * .32, y - size * .32, size * .18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#34477f";
  ctx.beginPath();
  ctx.arc(x, y + size * .28, size * .24, 0, Math.PI * 2);
  ctx.fill();
  for (let point = 0; point < 5; point += 1) {
    const angle = -Math.PI / 2 + point * Math.PI * 2 / 5;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * size * .12, y + size * .28 + Math.sin(angle) * size * .12);
    ctx.lineTo(x + Math.cos(angle - .34) * size * .48, y + size * .28 + Math.sin(angle - .34) * size * .48);
    ctx.lineTo(x + Math.cos(angle + .34) * size * .48, y + size * .28 + Math.sin(angle + .34) * size * .48);
    ctx.closePath();
    ctx.fill();
  }
}

function drawToppingIcon(topping, x, y, size) {
  ctx.save();
  ctx.lineWidth = 1.5;
  if (topping.id === "blueberry") {
    drawBlueberry(x - size * .52, y + size * .22, size * .58);
    drawBlueberry(x + size * .35, y - size * .22, size * .62);
    drawBlueberry(x + size * .72, y + size * .48, size * .5);
  } else if (topping.id === "strawberry") {
    ctx.fillStyle = "#e74455";
    ctx.beginPath();
    ctx.moveTo(x - size * .72, y - size * .42);
    ctx.quadraticCurveTo(x, y - size * 1.05, x + size * .72, y - size * .42);
    ctx.quadraticCurveTo(x + size * .6, y + size * .42, x, y + size);
    ctx.quadraticCurveTo(x - size * .6, y + size * .42, x - size * .72, y - size * .42);
    ctx.fill();
    ctx.fillStyle = "#5a9b55";
    ctx.beginPath();
    ctx.moveTo(x - size * .7, y - size * .48);
    ctx.lineTo(x - size * .25, y - size * .38);
    ctx.lineTo(x, y - size * .78);
    ctx.lineTo(x + size * .23, y - size * .37);
    ctx.lineTo(x + size * .7, y - size * .48);
    ctx.lineTo(x + size * .36, y - size * .16);
    ctx.lineTo(x - size * .38, y - size * .16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffe6a6";
    [[-.3, 0], [.24, .03], [0, .4]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(x + size * dx, y + size * dy, 1, 1.7, -.3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (topping.id === "cherry") {
    ctx.strokeStyle = "#568b4a";
    ctx.beginPath();
    ctx.moveTo(x - size * .15, y - size * .3);
    ctx.quadraticCurveTo(x - size * .28, y - size * 1.2, x + size * .35, y - size * 1.05);
    ctx.moveTo(x + size * .15, y - size * .28);
    ctx.quadraticCurveTo(x + size * .18, y - size * 1.1, x + size * .58, y - size * .9);
    ctx.stroke();
    ctx.fillStyle = "#c72d4c";
    [[-.25, .23], [.32, .28]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(x + size * dx, y + size * dy, size * .48, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,.6)";
    ctx.beginPath();
    ctx.arc(x - size * .4, y + size * .04, size * .12, 0, Math.PI * 2);
    ctx.fill();
  } else if (topping.id === "grape") {
    ctx.fillStyle = "#8661bd";
    [[0, -.45], [-.4, -.05], [.4, -.05], [-.2, .38], [.2, .38], [0, .75]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(x + size * dx, y + size * dy, size * .35, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#6b9a4e";
    ctx.beginPath();
    ctx.ellipse(x + size * .35, y - size * .75, size * .32, size * .15, -.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (topping.id === "orange") {
    ctx.fillStyle = "#f39a3c";
    ctx.beginPath();
    ctx.arc(x, y, size * .72, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffe4a8";
    ctx.lineWidth = 1;
    for (let slice = 0; slice < 6; slice += 1) {
      const angle = slice * Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size * .62, y + Math.sin(angle) * size * .62);
      ctx.stroke();
    }
    ctx.fillStyle = "#69a657";
    ctx.beginPath();
    ctx.ellipse(x + size * .45, y - size * .62, size * .28, size * .13, -.45, 0, Math.PI * 2);
    ctx.fill();
  } else if (topping.id === "kiwi") {
    ctx.fillStyle = "#8b5b3c";
    ctx.beginPath();
    ctx.arc(x, y, size * .75, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8fc45c";
    ctx.beginPath();
    ctx.arc(x, y, size * .58, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff1c4";
    ctx.beginPath();
    ctx.arc(x, y, size * .16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4d6639";
    for (let seed = 0; seed < 8; seed += 1) {
      const angle = seed * Math.PI / 4;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * size * .39, y + Math.sin(angle) * size * .39, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (topping.id === "peach") {
    ctx.fillStyle = "#f39b9b";
    ctx.beginPath();
    ctx.arc(x, y, size * .68, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c86c77";
    ctx.beginPath();
    ctx.moveTo(x, y - size * .58);
    ctx.quadraticCurveTo(x - size * .28, y, x, y + size * .6);
    ctx.stroke();
    ctx.fillStyle = "#76a755";
    ctx.beginPath();
    ctx.ellipse(x + size * .34, y - size * .6, size * .3, size * .14, -.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (topping.id === "cookie") {
    ctx.fillStyle = "#d6a16a";
    ctx.beginPath();
    ctx.arc(x, y, size * .72, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#70432f";
    [[-.35, -.32], [.3, -.28], [-.1, .05], [.38, .32], [-.38, .36]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(x + size * dx, y + size * dy, size * .12, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

// 配料採用不同的 Canvas 圖案繪製，不依賴系統 emoji 字型。
function drawTopping(topping) {
  const positions = [[330, 165], [360, 146], [390, 165]];
  positions.forEach(([x, y]) => drawToppingIcon(topping, x, y, 12));
}

// 根據目前已選的材料由底至頂重新畫出蛋糕。
function drawCake() {
  if (!ctx) return;
  const width = 720;
  const height = 310;
  drawWorkshop(width, height);
  if (!state.cake.base) {
    return;
  }

  drawCakeBase(state.cake.base);
  if (state.cake.cream) drawCream(state.cake.cream, state.cake.base);
  if (state.cake.topping) drawTopping(state.cake.topping);
}

function updateIngredientSteps() {
  document.querySelector("#baseStep").hidden = state.activeStep !== 0;
  document.querySelector("#creamStep").hidden = state.activeStep !== 1;
  document.querySelector("#toppingStep").hidden = state.activeStep !== 2;
  document.querySelector("#stepComplete").hidden = state.activeStep !== 3;
  document.querySelector("#backStepButton").disabled = state.activeStep === 0;
  const stepLabels = ["第 1 步／3：選擇蛋糕體", "第 2 步／3：選擇奶油口味", "第 3 步／3：選擇裝飾配料", "製作完成"];
  document.querySelector("#stepIndicator").textContent = stepLabels[state.activeStep];
}

// 依照蛋糕體、奶油、裝飾的順序選材料，不會自動輪替或隨機挑選。
function selectIngredient(category, ingredientId) {
  if (category === "cream" && !state.cake.base) {
    message.textContent = "請先選擇蛋糕體，再挑選奶油口味。";
    return;
  }
  if (category === "topping" && !state.cake.cream) {
    message.textContent = state.cake.base
      ? "請先選擇奶油口味，再挑選裝飾配料。"
      : "請先選擇蛋糕體和奶油口味，再挑選裝飾配料。";
    return;
  }

  const options = {
    base: INGREDIENTS.bases,
    cream: INGREDIENTS.creams,
    topping: INGREDIENTS.toppings
  }[category];
  if (!options) {
    message.textContent = "找不到這項材料分類，請重新選擇。";
    return;
  }
  const ingredient = options.find((option) => option.id === ingredientId);
  if (!ingredient) {
    message.textContent = "找不到這項材料，請重新選擇。";
    return;
  }

  // 更換前一層材料時，清除後續材料，避免蛋糕製作順序與畫面不一致。
  if (category === "base" && state.cake.base?.id !== ingredient.id) {
    state.cake.cream = null;
    state.cake.topping = null;
    document.querySelectorAll('.ingredient-button[data-category="cream"], .ingredient-button[data-category="topping"]')
      .forEach((button) => button.setAttribute("aria-pressed", "false"));
  } else if (category === "cream" && state.cake.cream?.id !== ingredient.id) {
    state.cake.topping = null;
    document.querySelectorAll('.ingredient-button[data-category="topping"]')
      .forEach((button) => button.setAttribute("aria-pressed", "false"));
  }

  state.cake[category] = ingredient;
  if (state.orderStartedAt === null) {
    state.orderStartedAt = Date.now();
  }
  state.activeStep = category === "base" ? 1 : category === "cream" ? 2 : 3;
  document.querySelectorAll(`.ingredient-button[data-category="${category}"]`).forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.ingredient === ingredientId));
  });
  updateIngredientSteps();
  updateTimerDisplay();
  const nextStep = category === "base" ? "請選擇奶油口味。" :
    category === "cream" ? "請選擇裝飾配料。" : "蛋糕完成，可以交給客人了！";
  message.textContent = `已選擇${ingredient.name}。${nextStep}`;
  drawCake();
}

// 依訂單完成狀況與時間星等計算可獲得的經驗值。
function submitCake() {
  if (!state.cake.base || !state.cake.cream || !state.cake.topping) {
    message.textContent = "蛋糕還沒完成喔！請放上蛋糕體、奶油和裝飾。";
    return;
  }

  const correctCount = ["base", "cream", "topping"].filter(
    (part) => state.cake[part].id === state.order[part].id
  ).length;
  const elapsedMilliseconds = state.orderStartedAt === null
    ? 0
    : Date.now() - state.orderStartedAt;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  const starRating = correctCount === 3 ? getStarRating(elapsedMilliseconds) : 0;
  const starDisplay = `${"★".repeat(starRating)}${"☆".repeat(5 - starRating)}`;
  const earnedExperience = correctCount === 3 ? 20 * starRating : 0;
  const earnedCoins = correctCount === 3 ? 10 * starRating : 0;

  const levelResult = awardExperience(earnedExperience, earnedCoins);

  if (correctCount === 3) {
    message.textContent = `太完美了！獲得 ${earnedExperience} XP 和 ${earnedCoins} 金幣！`;
  } else {
    message.textContent = `有 ${correctCount} 項符合訂單，沒有獲得經驗值或金幣。再試一次全對吧！`;
  }
  message.textContent += ` 製作 ${elapsedSeconds.toFixed(1)} 秒，獲得 ${starDisplay}（${starRating} 顆星）。`;
  if (levelResult.leveledUp) {
    message.textContent += ` 升級了！現在是等級 ${state.level}：${levelTitle.textContent}。`;
  }
  if (!levelResult.saved) {
    message.textContent += " 等級與金幣進度無法保存，請檢查瀏覽器的本機儲存設定。";
  }

  showOutcome({
    success: correctCount === 3,
    elapsedSeconds,
    starDisplay,
    starRating,
    experience: earnedExperience,
    coins: earnedCoins
  });

  // 交付後移除已完成的訂單並補入新訂單，候單數量維持不變。
  state.cake = { base: null, cream: null, topping: null };
  state.activeStep = 0;
  state.orderStartedAt = null;
  document.querySelectorAll(".ingredient-button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  updateIngredientSteps();
  state.orders.shift();
  state.orders.push(createOrder());
  renderOrders();
  updateTimerDisplay();
  drawCake();
}

// 重做只清除尚未交付的蛋糕，不影響已累積的經驗值。
function clearCake() {
  state.cake = { base: null, cream: null, topping: null };
  state.activeStep = 0;
  state.orderStartedAt = null;
  document.querySelectorAll(".ingredient-button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  updateIngredientSteps();
  updateTimerDisplay();
  message.textContent = "蛋糕已清空。第 1 步：先選擇蛋糕體。";
  drawCake();
}

document.querySelector(".controls").addEventListener("click", (event) => {
  const button = event.target.closest(".ingredient-button");
  if (button) selectIngredient(button.dataset.category, button.dataset.ingredient);
});
document.querySelector("#backStepButton").addEventListener("click", () => {
  if (state.activeStep === 0) return;
  state.activeStep -= 1;
  updateIngredientSteps();
  const stepMessages = [
    "返回蛋糕體步驟，可以重新選擇蛋糕體。",
    "返回奶油口味步驟，可以重新選擇口味。",
    "返回裝飾配料步驟，可以重新選擇配料。"
  ];
  message.textContent = stepMessages[state.activeStep];
});
document.querySelector("#submitButton").addEventListener("click", submitCake);
document.querySelector("#clearButton").addEventListener("click", clearCake);
document.querySelector("#outcomeClose").addEventListener("click", () => outcomeDialog.close());
outcomeDialog.addEventListener("click", (event) => {
  if (event.target === outcomeDialog) outcomeDialog.close();
});
document.querySelector("#editNicknameButton").addEventListener("click", () => {
  nicknameInput.value = state.nickname;
  nicknameTitle.textContent = "修改玩家暱稱";
  nicknameDescription.textContent = "修改暱稱會花費 500 金幣。";
  nicknameCost.textContent = `目前金幣：${state.totalCoins}`;
  nicknameSubmitButton.textContent = "儲存暱稱";
  nicknameError.textContent = "";
  nicknameDialog.showModal();
  nicknameInput.focus();
});
function renderAvatarOptions() {
  avatarOptions.replaceChildren(...AVATARS.map((avatar, index) => {
    const button = document.createElement("button");
    button.className = "avatar-option";
    button.type = "button";
    const isPurchased = !avatar.purchaseCost || state.purchasedAvatarIds.includes(avatar.id);
    const levelUnlocked = !avatar.unlockLevel || state.level >= avatar.unlockLevel;
    const alreadyPurchased = state.purchasedAvatarIds.includes(avatar.id);
    const canSelect = (levelUnlocked && !avatar.permanentlyLocked) || alreadyPurchased;
    const isUnlocked = canSelect && isPurchased;
    button.disabled = !canSelect;
    button.setAttribute(
      "aria-label",
      !canSelect
        ? avatar.permanentlyLocked
          ? "已永久鎖定，無法購買"
          : `已鎖定，等級 ${avatar.unlockLevel} 解鎖`
        : isUnlocked
          ? `選擇第 ${index + 1} 張頭像`
          : `購買第 ${index + 1} 張頭像，${avatar.purchaseCost} 金幣`
    );
    button.setAttribute("aria-pressed", String(index === state.avatarIndex));

    const image = document.createElement("img");
    image.src = avatar.image;
    image.alt = "";
    image.loading = "lazy";
    button.append(image);
    if (!canSelect) {
      const lockLabel = document.createElement("span");
      lockLabel.className = "avatar-lock-label";
      lockLabel.textContent = avatar.permanentlyLocked ? "🔒 無法購買" : `🔒 ${avatar.unlockLevel} 級`;
      button.append(lockLabel);
    } else {
      if (!isPurchased) {
        const priceLabel = document.createElement("span");
        priceLabel.className = "avatar-lock-label";
        const coinImage = document.createElement("img");
        coinImage.src = "./assets/coin.jpg";
        coinImage.alt = "";
        const priceText = document.createElement("span");
        priceText.textContent = String(avatar.purchaseCost);
        priceLabel.append(coinImage, priceText);
        button.append(priceLabel);
      }
      button.addEventListener("click", () => {
        if (!isPurchased) {
          if (state.totalCoins < avatar.purchaseCost) {
            message.textContent =
              `金幣不足，購買此頭像需要 ${avatar.purchaseCost} 金幣（目前有 ${state.totalCoins} 金幣）。`;
            return;
          }
          pendingAvatarPurchase = { avatar, index };
          avatarConfirmText.textContent =
            `要花費 ${avatar.purchaseCost} 金幣購買這個頭像嗎？目前有 ${state.totalCoins} 金幣。`;
          avatarDialog.close();
          avatarConfirmDialog.showModal();
          document.querySelector("#avatarConfirmBuy").focus();
          return;
        }

        applyAvatarSelection(avatar, index);
      });
    }
    return button;
  }));
}

function applyAvatarSelection(avatar, index) {
  if (avatar.purchaseCost && !state.purchasedAvatarIds.includes(avatar.id)) {
    if (state.totalCoins < avatar.purchaseCost) {
      message.textContent =
        `金幣不足，購買此頭像需要 ${avatar.purchaseCost} 金幣（目前有 ${state.totalCoins} 金幣）。`;
      return;
    }

    const purchasedAvatarIds = [...state.purchasedAvatarIds, avatar.id];
    const remainingCoins = state.totalCoins - avatar.purchaseCost;
    try {
      localStorage.setItem(
        progressStorageKey,
        JSON.stringify({
          totalExperience: state.totalExperience,
          totalCoins: remainingCoins,
          purchasedAvatarIds
        })
      );
    } catch (error) {
      console.error("保存頭像購買紀錄失敗：", error);
      message.textContent = "無法保存頭像購買紀錄，金幣未扣除；請檢查瀏覽器的本機儲存設定。";
      return;
    }
    state.totalCoins = remainingCoins;
    state.purchasedAvatarIds = purchasedAvatarIds;
    message.textContent = `已花費 ${avatar.purchaseCost} 金幣購買頭像。`;
  }

  state.avatarIndex = index;
  updateLevelDisplay();
  renderAvatarOptions();
  try {
    localStorage.setItem("milk-frog-cake-shop-avatar", String(index));
  } catch (error) {
    console.error("保存玩家頭像失敗：", error);
    message.textContent += "頭像已套用，但無法保存目前選擇；重新載入後可能會還原。";
  }
}

document.querySelector("#avatarConfirmCancel").addEventListener("click", () => {
  pendingAvatarPurchase = null;
  avatarConfirmDialog.close();
  renderAvatarOptions();
  avatarDialog.showModal();
});
document.querySelector("#avatarConfirmBuy").addEventListener("click", () => {
  const purchase = pendingAvatarPurchase;
  pendingAvatarPurchase = null;
  avatarConfirmDialog.close();
  if (!purchase) return;
  applyAvatarSelection(purchase.avatar, purchase.index);
  renderAvatarOptions();
  avatarDialog.showModal();
});
avatarConfirmDialog.addEventListener("close", () => {
  if (pendingAvatarPurchase) {
    renderAvatarOptions();
    avatarDialog.showModal();
  }
  pendingAvatarPurchase = null;
});

avatarSwitch.addEventListener("click", () => {
  renderAvatarOptions();
  avatarDialog.showModal();
});
document.querySelector("#avatarDialogClose").addEventListener("click", () => avatarDialog.close());
avatarDialog.addEventListener("click", (event) => {
  if (event.target === avatarDialog) avatarDialog.close();
});
function renderLevelUnlockProgress() {
  const rewards = [
    { level: 50, name: "解鎖左側相框照片頭像", image: "./assets/emo.png.jpg" },
    { level: 100, name: "解鎖右側相框照片頭像", image: "./assets/s.png.jpg" }
  ];

  levelUnlockProgress.replaceChildren(...rewards.map((reward) => {
    const item = document.createElement("div");
    item.className = "level-unlock-item";

    const image = document.createElement("img");
    image.src = reward.image;
    image.alt = "";

    const details = document.createElement("div");
    details.className = "level-unlock-details";
    const heading = document.createElement("strong");
    heading.textContent = `${reward.level} 級`;
    const status = document.createElement("span");
    const progress = document.createElement("div");
    progress.className = "unlock-progress-track";
    const fill = document.createElement("div");
    fill.className = "unlock-progress-fill";

    const unlocked = state.level >= reward.level;
    const progressPercent = Math.min((state.level / reward.level) * 100, 100);
    status.textContent = unlocked
      ? "已解鎖，可在頭像選單選擇"
      : `目前等級 ${state.level}／${reward.level}`;
    fill.style.width = `${progressPercent}%`;
    progress.append(fill);
    details.append(heading, status, progress);
    item.append(image, details);
    return item;
  }));
}

document.querySelector("#levelProgressButton").addEventListener("click", () => {
  renderLevelUnlockProgress();
  levelProgressDialog.showModal();
});
document.querySelector("#levelProgressClose").addEventListener("click", () => {
  levelProgressDialog.close();
});
levelProgressDialog.addEventListener("click", (event) => {
  if (event.target === levelProgressDialog) levelProgressDialog.close();
});
document.querySelector("#cancelNicknameButton").addEventListener("click", () => {
  if (state.nickname) nicknameDialog.close();
});
nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) {
    nicknameError.textContent = "請輸入暱稱後再繼續。";
    nicknameInput.setAttribute("aria-invalid", "true");
    nicknameInput.focus();
    return;
  }

  nicknameInput.removeAttribute("aria-invalid");
  nicknameError.textContent = "";
  if (nickname === state.nickname) {
    nicknameDialog.close();
    return;
  }

  const renameCost = state.nickname ? 500 : 0;
  if (state.totalCoins < renameCost) {
    nicknameError.textContent = `金幣不足，修改暱稱需要 500 金幣（目前有 ${state.totalCoins} 金幣）。`;
    nicknameInput.focus();
    return;
  }

  try {
    if (renameCost > 0) {
      localStorage.setItem(
        progressStorageKey,
        JSON.stringify({
          totalExperience: state.totalExperience,
          totalCoins: state.totalCoins - renameCost,
          purchasedAvatarIds: state.purchasedAvatarIds
        })
      );
    }
    localStorage.setItem(nicknameStorageKey, nickname);
  } catch (error) {
    console.error("保存玩家暱稱失敗：", error);
    if (renameCost > 0) {
      try {
        localStorage.setItem(
          progressStorageKey,
          JSON.stringify({
            totalExperience: state.totalExperience,
            totalCoins: state.totalCoins,
            purchasedAvatarIds: state.purchasedAvatarIds
          })
        );
      } catch (rollbackError) {
        console.error("還原修改暱稱扣除的金幣失敗：", rollbackError);
      }
    }
    nicknameError.textContent = "暱稱無法保存，請檢查瀏覽器的本機儲存設定後再試。";
    return;
  }

  state.nickname = nickname;
  state.totalCoins -= renameCost;
  updateLevelDisplay();
  nicknameDialog.close();
});
nicknameInput.addEventListener("input", () => {
  nicknameError.textContent = "";
  nicknameInput.removeAttribute("aria-invalid");
});
nicknameDialog.addEventListener("cancel", (event) => {
  if (!state.nickname) event.preventDefault();
});
window.addEventListener("resize", resizeCanvas);
window.setInterval(updateTimerDisplay, 100);

// 載入主角與場景素材後重繪畫布。
frogImage.addEventListener("load", drawCake);
frogImage.addEventListener("error", () => {
  message.textContent = "無法載入奶蛙.webp，請確認 assets 資料夾和 index.html 都完整。";
});
frogImage.src = "./assets/奶蛙.webp";
wallPictures[0].addEventListener("load", drawCake);
wallPictures[1].addEventListener("load", drawCake);
wallPictures[0].addEventListener("error", () => {
  console.error("無法載入左側牆面照片 assets/emo.png.jpg。");
});
wallPictures[1].addEventListener("error", () => {
  console.error("無法載入右側牆面照片 assets/s.png.jpg。");
});
wallPictures[0].src = "./assets/emo.png.jpg";
wallPictures[1].src = "./assets/s.png.jpg";

// 開始遊戲：先準備三張待製作訂單，之後每完成一張就即時補入新單。
for (let index = 0; index < 3; index += 1) {
  state.orders.push(createOrder());
}
renderOrders();
updateLevelDisplay();
updateIngredientSteps();
resizeCanvas();
if (!state.nickname) {
  nicknameInput.value = "";
  nicknameTitle.textContent = "設定玩家暱稱";
  nicknameDescription.textContent = "開始遊戲前，先輸入你的暱稱吧！";
  nicknameCost.textContent = "首次設定免費；修改暱稱需 500 金幣。";
  nicknameSubmitButton.textContent = "開始遊戲";
  document.querySelector("#cancelNicknameButton").hidden = true;
  nicknameDialog.showModal();
  nicknameInput.focus();
} else {
  document.querySelector("#cancelNicknameButton").hidden = false;
}
