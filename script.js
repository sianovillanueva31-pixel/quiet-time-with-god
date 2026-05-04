const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("app").style.display = "block";
    loadEntries();
  } else {
    document.getElementById("app").style.display = "none";
  }
});

function saveEntry() {
  const user = auth.currentUser;

  const data = {
    title: document.getElementById("title").value,
    entry: document.getElementById("entry").value,
    prayer: document.getElementById("prayer").value,
    completed: document.getElementById("completed").checked,
    date: new Date().toLocaleString()
  };

  db.collection("users")
    .doc(user.uid)
    .collection("entries")
    .add(data)
    .then(() => {
      alert("Saved!");
      loadEntries();
    });
}

function loadEntries() {
  const user = auth.currentUser;
  const container = document.getElementById("entries");
  container.innerHTML = "";

  db.collection("users")
    .doc(user.uid)
    .collection("entries")
    .orderBy("date", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const d = doc.data();

        container.innerHTML += `
          <div class="entry">
            <h3>${d.title}</h3>
            <p>${d.entry}</p>
            <p><b>Prayer:</b> ${d.prayer}</p>
            <p>✅ Completed: ${d.completed}</p>
            <small>${d.date}</small>
          </div>
        `;
      });
    });
}
