(() => {
  self.init = () => {
    self.buildCSS();
    self.setEvents();
  };

  self.buildCSS = () => {
    const css = `

    .main-wrapper {
  display: block;
  position: relative;
  margin-right: 55px !important;
  margin-left: 55px !important;
  box-sizing: border-box;
}
.wrapper-header {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin: 20px 0;
}
.product {
  flex: 0 0 auto;
  width: 400px; /* kart genişliği */
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.product-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
}
.product-image {
  width: 100%;
  height: auto;
  margin: 5px 0;
  object-fit: cover;
}
.product-name,
.product-price {
  text-align: center;
  font-size: 14px;
}
.product-name {
  margin-top: 8px;
  font-weight: 500;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.product-price {
  color: #333;
  font-weight: bold;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.arrow-element-prev {
  display: block !important;
  position: absolute;
  cursor: pointer;
  top: 50%;
  left: -5px;
  padding: 12px !important;
  border-radius: 100% !important;
  background-color: #fff;
  box-shadow: 0 0 1px #28293d0a, 0 0.5px 2px #60617029;
  width: 22px;
  height: 22px;
  font-weight: bolder;
  background-image: url(https://www.svgrepo.com/show/522366/chevron-left.svg);
  background-size: 100%;
  background-repeat: no-repeat;
}
.arrow-element-next {
  display: block !important;
  position: absolute;
  cursor: pointer;
  top: 50%;
  right: -35px;
  padding: 12px !important;
  border-radius: 100% !important;
  background-color: #fff;
  box-shadow: 0 0 1px #28293d0a, 0 0.5px 2px #60617029;
  width: 22px;
  height: 22px;
  font-weight: bolder;
  background-image: url(https://www.svgrepo.com/show/522374/chevron-right.svg);
  background-size: 100%;
  background-repeat: no-repeat;
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

    const carouselHtml = `
      <div class="main-wrapper">
        <p class="wrapper-header">Birlikte Tercih Edilenler</p>
        <button class="arrow-element-prev"></button>
        <ul class="product-wrapper">
          ${carouselData}
        </ul>
        <button class="arrow-element-next"></button>
      </div>

    `;

    $("footer").prepend(carouselHtml);

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
