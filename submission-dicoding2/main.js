const inputJudul = document.getElementById("inputBookTitle");
const inputPenulis = document.getElementById("inputBookAuthor");
const inputTahun = document.getElementById("inputBookYear");
const chekclistSelesai = document.getElementById("inputBookIsComplete");
const submitBtn = document.getElementById("bookSubmit");
const searchBtn = document.getElementById("searchSubmit");
const searchTitle = document.getElementById("searchBookTitle");
const span = submitBtn.children[0];
const spanValDefaults = span.innerText;
const belumSelesai = document.getElementById("incompleteBookshelfList");
const sudahSelesai = document.getElementById("completeBookshelfList");
let dataBuku = [];

function saveData(data) {
  localStorage.setItem("dataBuku", JSON.stringify(data));
}
// async const loadData = () => {

// };
async function loadData() {
  return JSON.parse(localStorage.getItem("dataBuku")) || [];
}
function appendYourElement(judul, penulis, tahun, isComplete, id) {
  const article = document.createElement("article");
  article.classList.add("book_item");
  const h3 = document.createElement("h3");
  h3.setAttribute("id", id);
  const pPenulis = document.createElement("p");
  const pTahun = document.createElement("p");
  const action = document.createElement("div");
  action.classList.add("action");
  const buttonGreen = document.createElement("button");
  buttonGreen.classList.add("green");
  const buttonRed = document.createElement("button");
  buttonRed.classList.add("red");
  h3.innerText = judul;
  pPenulis.innerText = `Penulis: ${penulis}`;
  pTahun.innerText = `Tahun: ${tahun}`;
  buttonRed.innerText = "Hapus Buku";
  buttonGreen.innerText =
    isComplete == true ? "Belum selesai dibaca" : "Selesai dibaca";
  action.append(buttonGreen, buttonRed);
  article.append(h3, pPenulis, pTahun, action);
  return article;
}
document.addEventListener("DOMContentLoaded", async function (e) {
  dataBuku = await loadData();
  if (dataBuku.length > 0) {
    dataBuku.forEach((elem) => {
      const { id, title, author, year, isComplete } = elem;
      const article = appendYourElement(title, author, year, isComplete, id);

      if (isComplete == true) {
        sudahSelesai.appendChild(article);
      } else {
        belumSelesai.appendChild(article);
      }
    });
  }
  chekclistSelesai.addEventListener("click", function () {
    if (chekclistSelesai.checked) {
      span.innerText = "Sudah dibaca";
    } else {
      span.innerText = spanValDefaults;
    }
  });
  submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (inputJudul.value.trim() == "" || inputPenulis.value.trim() == "") {
      alert("Masukkan judul/penulis");
      inputJudul.value = "";
      inputPenulis.value = "";
      inputTahun.value = "";
      return;
    } else if (inputTahun.value > 2024 || inputTahun.value < 1900) {
      alert("Inputkan tahun di antara 1900 - 2024");
      inputJudul.value = "";
      inputPenulis.value = "";
      inputTahun.value = "";
      return;
    }
    const newPush = {
      id: +new Date(),
      title: inputJudul.value,
      author: inputPenulis.value,
      year: parseInt(inputTahun.value),
      isComplete: chekclistSelesai.checked,
    };

    dataBuku.push(newPush);
    saveData(dataBuku);
    dataBuku = await loadData();
    const { id, title, author, year, isComplete } =
      dataBuku[dataBuku.length - 1];
    const article = appendYourElement(title, author, year, isComplete, id);

    if (isComplete == true) {
      sudahSelesai.appendChild(article);
    } else {
      belumSelesai.appendChild(article);
    }
    inputJudul.value = "";
    inputPenulis.value = "";
    inputTahun.value = "";
  });
  belumSelesai.addEventListener("click", (e) => {
    const article = e.target.closest("article.book_item");
    const h3 = article.querySelector("h3");
    const idTarget = h3.getAttribute("id");
    const index = dataBuku.findIndex((item) => item.id == parseInt(idTarget));
    if (e.target.classList.contains("red")) {
      dataBuku.splice(index, 1);
      saveData(dataBuku);
      article.remove();
    } else if (e.target.classList.contains("green")) {
      dataBuku[index].isComplete = true;
      saveData(dataBuku);
      const { id, title, author, year, isComplete } = dataBuku[index];
      const doneBook = appendYourElement(title, author, year, isComplete, id);
      sudahSelesai.appendChild(doneBook);
      article.remove();
    }
  });
  sudahSelesai.addEventListener("click", (e) => {
    const article = e.target.closest("article.book_item");
    const h3 = article.querySelector("h3");
    const idTarget = h3.getAttribute("id");
    const index = dataBuku.findIndex((item) => item.id == parseInt(idTarget));
    if (e.target.classList.contains("red")) {
      dataBuku.splice(index, 1);
      saveData(dataBuku);
      article.remove();
    } else if (e.target.classList.contains("green")) {
      dataBuku[index].isComplete = false;
      saveData(dataBuku);
      const { id, title, author, year, isComplete } = dataBuku[index];
      const notYetBook = appendYourElement(title, author, year, isComplete, id);
      belumSelesai.appendChild(notYetBook);
      article.remove();
    }
  });
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const val = searchTitle.value.toLowerCase();
    const filterBooks = dataBuku.filter((elem) => {
      return elem.title.toLowerCase().includes(val);
    });
    belumSelesai.innerHTML = "";
    sudahSelesai.innerHTML = "";
    filterBooks.forEach((elem) => {
      const { id, title, author, year, isComplete } = elem;
      const article = appendYourElement(title, author, year, isComplete, id);
      if (isComplete == true) {
        sudahSelesai.appendChild(article);
      } else {
        belumSelesai.appendChild(article);
      }
    });
  });
  console.log(typeof dataBuku[0].id);
});
