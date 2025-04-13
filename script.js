(() => {
  self.init = () => {
    self.buildCSS();
    self.setEvents();
  };

  self.buildCSS = () => {
    const css = `
      .wrapper {
        width: 1570px;
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
        font-size: 32px;
        line-height: 43px;
        padding: 15px 0;
      }
      .product-image{
        width: 210px;
        height: 280px;
        margin: 10px;
      }
      .product-hearth-icon{
        cursor: pointer;
        position: absolute;
        top: 9px;
        right: 15px;
        width: 34px;
        height: 34px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
        border: solid .5px #b6b7b9;
        display: flex;
        justify-content: center;
        align-items: center;
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
        color: #193db0;
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
        self.buildHTML(parsedData);
        self.likeProduct();
      } catch (e) {
        console.warn(
          "localStorage'daki veri parse edilemedi, yeniden fetch ediliyor."
        );
        fetchAndUseProductData();
      }
    } else {
      fetchAndUseProductData();
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
            <div class="product-price">${item.price} TRY</div>
          </li>`;
      })
      .join("");

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

    $(".product-detail").append(carouselHtml);

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

// container-mavi container-mavi--m-none altına eklenecek
