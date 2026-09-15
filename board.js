// board.js

const itemsGrid = document.getElementById("itemsGrid");
const postItemBtn = document.getElementById("postItemBtn");
const logoutBtn = document.getElementById("logoutBtn");
const boardMessage = document.getElementById("boardMessage");

let currentUser = null;

// --- Auth check ---
async function initBoard() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }
  currentUser = session.user;
  loadItems();
  subscribeToRealtimeUpdates();
}
initBoard();

// --- Load all items ---
async function loadItems() {
  const { data, error } = await supabaseClient
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    boardMessage.textContent = "Error loading items: " + error.message;
    boardMessage.style.color = "red";
    return;
  }

  renderItems(data);
}

// --- Render items ---
function renderItems(items) {
  itemsGrid.innerHTML = "";

  if (items.length === 0) {
    itemsGrid.innerHTML = "<p style='color:#F3EDE0;'>Nothing posted yet — be the first.</p>";
    return;
  }

  const tilts = ["tilt-a", "tilt-b", "tilt-c", "tilt-d"];

  items.forEach((item, index) => {
    const card = document.createElement("div");
    const isOwner = item.user_id === currentUser.id;
    const badgeClass = item.status === "resolved" ? "resolved" : item.item_type;
    const badgeText = item.status === "resolved" ? "Resolved" : item.item_type;

    card.className = `item-card ${tilts[index % tilts.length]}`;

    card.innerHTML = `
      <div class="pin ${badgeClass}"></div>
      ${item.image_url ? `<img src="${item.image_url}" alt="${escapeHtml(item.title)}" />` : ""}
      <div class="item-card-body">
        <span class="item-badge ${badgeClass}">${badgeText}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
        <p class="location">${escapeHtml(item.location || "Location not specified")}</p>
        ${isOwner && item.status !== "resolved" ? `<button class="resolve-btn" data-id="${item.id}">Mark Resolved</button>` : ""}
        ${isOwner ? `<button class="delete-item-btn" data-id="${item.id}">Delete</button>` : ""}
      </div>
    `;

    itemsGrid.appendChild(card);
  });

  document.querySelectorAll(".resolve-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => markResolved(e.target.dataset.id));
  });

  document.querySelectorAll(".delete-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteItem(e.target.dataset.id));
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- Post a new item (with optional image upload) ---
postItemBtn.addEventListener("click", async () => {
  const type = document.getElementById("itemType").value;
  const title = document.getElementById("itemTitle").value.trim();
  const description = document.getElementById("itemDescription").value.trim();
  const location = document.getElementById("itemLocation").value.trim();
  const imageFile = document.getElementById("itemImage").files[0];

  if (!title) {
    boardMessage.textContent = "Please enter a title.";
    boardMessage.style.color = "red";
    return;
  }

  postItemBtn.disabled = true;
  postItemBtn.textContent = "Posting...";

  let imageUrl = null;

  // Upload image if one was selected
  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("item-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      boardMessage.textContent = "Image upload failed: " + uploadError.message;
      boardMessage.style.color = "red";
      postItemBtn.disabled = false;
      postItemBtn.textContent = "Post Item";
      return;
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabaseClient.storage
      .from("item-images")
      .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  // Insert the item row
  const { error: insertError } = await supabaseClient.from("items").insert([
    {
      user_id: currentUser.id,
      title,
      description,
      location,
      item_type: type,
      image_url: imageUrl,
    },
  ]);

  postItemBtn.disabled = false;
  postItemBtn.textContent = "Post Item";

  if (insertError) {
    boardMessage.textContent = "Error posting item: " + insertError.message;
    boardMessage.style.color = "red";
    return;
  }

  // Clear form
  document.getElementById("itemTitle").value = "";
  document.getElementById("itemDescription").value = "";
  document.getElementById("itemLocation").value = "";
  document.getElementById("itemImage").value = "";
  boardMessage.textContent = "";

  loadItems();
});

// --- Mark resolved ---
async function markResolved(id) {
  const { error } = await supabaseClient
    .from("items")
    .update({ status: "resolved" })
    .eq("id", id);

  if (error) {
    boardMessage.textContent = "Error: " + error.message;
    boardMessage.style.color = "red";
    return;
  }
  loadItems();
}

// --- Delete item ---
async function deleteItem(id) {
  const { error } = await supabaseClient.from("items").delete().eq("id", id);

  if (error) {
    boardMessage.textContent = "Error: " + error.message;
    boardMessage.style.color = "red";
    return;
  }
  loadItems();
}

// --- Realtime: reload the board whenever ANY change happens to items ---
function subscribeToRealtimeUpdates() {
  supabaseClient
    .channel("items-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "items" },
      (payload) => {
        loadItems();
      }
    )
    .subscribe();
}

// --- Logout ---
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});