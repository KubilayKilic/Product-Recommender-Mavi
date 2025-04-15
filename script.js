(() => {
  self.init = () => {
    self.buildCSS();
    self.setEvents();
  };

  self.buildCSS = () => {
    const css2 = `
    .main-wrapper {
      position: relative;
      overflow: hidden;
      height: 410px;
      direction: ltr !important;
    }
    .wrapper-header {
      font-size: 16px;
      color: #000000;
      margin: 20px 0;
    }
    .wrapper-body {
      width: 1319px;
    }
    ul {
      transform: translateX(0px);
      width: 2762.5px;
      margin-left: 0;
      overflow: hidden;
      display: inline-block !important;
      padding: 0 !important;
      transition: 700ms transform;
    }
    .box-item {
    
    }
    li {
      background: #ffffff;
      border: 0px none #000000;
      border-radius: 0px;
      margin: 3px;
    }
    .arrow-element {
    display: block !important;
    position: absolute;
    padding: 12px !important;
    border-radius: 100% !important;
    background-color: #fff;
    box-shadow: 0 0 1px #28293d0a, 0 0.5px 2px #60617029;
    width: 35px;
    height: 35px;
    }
    .arrow-element-prev {
      transform: translateY(-50%) rotate(180deg);
      left: 14px;
      background: transparent;
      cursor: pointer;
      top: 50%;
      z-index: 3;
    }
    .arrow-element-next {
      transform: translateY(-50%) rotate(0deg);
      right: 14px;
      background: transparent;
      cursor: pointer;
      top: 50%;
      z-index: 3;
    }
    `;
    const css = `
      .wrapper {
        width: 100%;
        background-color: #faf9f7;
        margin: 0 auto;
        padding: 10px;
        position: relative;
      }
      .product-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        gap: 10px;
        flex-direction: row;
        overflow-x: scroll;
        padding: 0px !important;
        scroll-behavior: smooth;
        margin: auto;
      }
      .product-wrapper::-webkit-scrollbar {
        display: none;
      }
      .product{
        position: relative;
        background-color: #fff;
      }
      .product-header {
        font-size: 16px;
        line-height: 43px;
        margin: 20px 0;
      }
      .product-image{
        width: 399px;
        height: 599px;
        margin: 10px;
      }
      .product-name{
        font-size: 12px;
        color: black;
        margin: 0 auto;
        width: 90%;
        height: 50px;
      }
      .product-price{
        font-size: 16px;
        color: #000000;
        margin: 0 auto;
        width: 90%;
        font-weight: bold;
      }
      ul {
        list-style: none!important;
      }
      .prev-btn, .next-btn {
        border: none;
        background-color: transparent;
        font-weight: bold;
        width: 40px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0% #fff 100%);
        cursor: pointer;
        z-index: 9;
        margin: 15px;
        position: absolute;
        top: 43%;
      }
      .prev-btn {
        left: -70px;
      }
      .next-btn {
        right: -70px;
      }
      @media only screen and (max-width: 1750px) {
        .wrapper {
          width: 1450px;
        }
      }
      @media only screen and (max-width: 1600px) {
        .wrapper {
          width: 1300px;
        }
      }
      @media only screen and (max-width: 1440px) {
        .wrapper {
          width: 1100px;
        }
      }
      @media only screen and (max-width: 1366px) {
        .wrapper {
          width: auto;
        }
        .prev-btn, .next-btn {
          display: none;
        }
      }
      }
  `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  self.setEvents = () => {
    async function getProductData() {
      const xhr = new XMLHttpRequest();
      const url =
        "https://gist.githubusercontent.com/KubilayKilic/00567e2da1f8f9261b007a7eb0f66b4d/raw/df8856929db9b2e39fa0a22df6cea740618fd123/mavi_recommender_data.json";

      return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } else {
              reject(
                new Error("Product datası fetch edilirken bir hata oluştu.")
              );
            }
          }
        };
        xhr.open("GET", url);
        xhr.send();
      });
    }

    const productData = localStorage.getItem("productData");

    if (productData) {
      try {
        const parsedData = JSON.parse(productData);
        if (parsedData) {
          // Eğer veriler başarıyla parse edildiyse, sadece buildHTML çalıştır
          self.buildHTML(parsedData);
        } else {
          console.warn("Geçersiz veri bulundu, yeniden veri çekilecek.");
          fetchAndUseProductData(); // Verinin içeriği geçersizse veriyi tekrar çek
        }
      } catch (e) {
        console.warn(
          "localStorage'daki veri parse edilemedi, yeniden fetch ediliyor."
        );
        fetchAndUseProductData();
      }
    } else {
      fetchAndUseProductData(); // Eğer localStorage'da veri yoksa veriyi çek
    }

    function fetchAndUseProductData() {
      getProductData()
        .then((data) => {
          localStorage.setItem("productData", JSON.stringify(data));
          self.buildHTML(data);
        })
        .catch((err) => {
          console.error("Veri çekilemedi:", err);
        });
    }
  };

  self.buildHTML = (data) => {
    const carouselData = data
      .map((item) => {
        return `
          <li class="product" id=${item.id}>
          <a href=${item.url} target="_blank">
            <img class="product-image" src="${item.img}"></img>
          </a>
            <div class="product-name">${item.name}</div>
            <div class="product-price">${item.price} TL</div>
          </li>`;
      })
      .join("");

    const carouselHtml2 = `
    <div class="main-wrapper">
    <div class="wrapper-header"></div>
    <div class="wrapper_body">
      <ul class=""><ul>
    </div>
    </div>
    `;

    const carouselHtml = `
      <div class="wrapper">
        <p class="product-header">Birlikte Tercih Edilenler</p>
        <button class="prev-btn"><</button>
        <ul class="product-wrapper">
          ${carouselData}
        </ul>
        <button class="next-btn">></button>
      </div>

    `;

    $(".product").append(carouselHtml);

    self.slider();
  };

  self.slider = () => {
    const productWrapper = $(".product-wrapper");
    const prevBtn = $(".prev-btn");
    const nextBtn = $(".next-btn");

    //debugger;
    productWrapper.each((index, item) => {
      let productWidth = 230;

      $(nextBtn[index]).on("click", () => {
        item.scrollLeft += productWidth;
      });
      $(prevBtn[index]).on("click", () => {
        item.scrollLeft -= productWidth;
      });
    });
  };

  // return self.init();
  self.init();
})();
