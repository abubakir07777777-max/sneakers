document.addEventListener('DOMContentLoaded', () => {
	// Elementlar
	const mainImg = document.querySelector('.main_shoes__img');
	const hero = document.querySelectorAll('.hero__list .hero__item');
	const minusBtn = document.querySelector('.minus');
	const plusBtn = document.querySelector('.plus');
	const countspan = document.querySelector('.span');
	const priceNew = document.querySelector('.new'); // Ekrandagi o'zgaruvchan narx
	const addToCartBtn = document.querySelector('.btn3');
	const cartIcon = document.querySelector('.cart__icon');
	const cartBox = document.querySelector('.cart__box');
	const cartContent = document.querySelector('.cart__content');
	const badge = document.querySelector('.badge');

	// Lightbox elementlari
	const imgdiv = document.getElementById('imgdiv');
	const imglarMain = document.querySelector('.imglar-main');
	const imglarThumbs = document.querySelectorAll('.imglar__list .imglar__item');
	const imglar = document.querySelector('.close-imglar');
	const prevBtn = document.querySelector('.prev');
	const nextBtn = document.querySelector('.next');

	// Mobil menyu
	const menuBtn = document.querySelector('.menu__btn');
	const closeBtn = document.querySelector('.close__btn');
	const headerList = document.querySelector('.header__list');

	// Dinamik ma'lumotlar massivi (Rasmlar ro'yxati)
	const imagesArray = [
		'image/Rectangle (1).png',
		'image/Rectangle Copy 2.png',
		'image/Rectangle Copy 3.png',
		'image/Rectangle Copy 4.png',
	];

	const singleProductPrice = 125.0;
	const productName = 'Fall Limited Edition Sneakers';

	let currentCount = 0; // Soni
	let cartCount = 0; // Savatchadagi soni
	let activeImageIndex = 0; // Hozirgi tanlangan rasm tartibi (0 dan 3 gacha)

	// --- 1. Narxni yangilash funksiyasi ---
	function updateProductPriceDisplay() {
		// Agar miqdor 0 bo'lsa ham 1 donasining narxini ko'rsatib turadi, aks holda ko'paytiradi
		const multiplier = currentCount > 0 ? currentCount : 1;
		const calculatedPrice = (singleProductPrice * multiplier).toFixed(2);
		priceNew.textContent = `$${calculatedPrice}`;
	}

	// --- 2. Asosiy Galereya hodisasi ---
	hero.forEach((item, index) => {
		item.addEventListener('click', () => {
			activeImageIndex = index;
			updateGalleryUI();
		});
	});

	function updateGalleryUI() {
		hero.forEach(el => el.classList.remove('active'));
		hero[activeImageIndex].classList.add('active');
		mainImg.setAttribute('src', imagesArray[activeImageIndex]);
	}

	// --- 3. Lightbox (Modal varaqlash funksiyasi) ---
	mainImg.addEventListener('click', () => {
		if (window.innerWidth > 768) {
			imgdiv.style.display = 'flex';
			updateimglarUI();
		}
	});

	function updateimglarUI() {
		imglarMain.src = imagesArray[activeImageIndex];
		imglarThumbs.forEach(thumb => thumb.classList.remove('active'));
		imglarThumbs[activeImageIndex].classList.add('active');
	}

	// O'ngga o'tkazish (Next)
	nextBtn.addEventListener('click', () => {
		activeImageIndex++;
		if (activeImageIndex >= imagesArray.length) {
			activeImageIndex = 0; // Oxiriga yetsa boshiga qaytadi
		}
		updateimglarUI();
		updateGalleryUI(); // Orqadagi asosiy rasmni ham sinxron almashtiradi
	});

	// Chapga o'tkazish (Prev)
	prevBtn.addEventListener('click', () => {
		activeImageIndex--;
		if (activeImageIndex < 0) {
			activeImageIndex = imagesArray.length - 1; // Boshida tursa oxiriga o'tadi
		}
		updateimglarUI();
		updateGalleryUI();
	});

	// Lightbox ichidagi kichik rasmlarni bosganda o'zgarishi
	imglarThumbs.forEach((item, index) => {
		item.addEventListener('click', () => {
			activeImageIndex = index;
			updateimglarUI();
			updateGalleryUI();
		});
	});

	// Modalni yopish
  imglar.addEventListener('click', () => (imgdiv.style.display = 'none'));
	imgdiv.addEventListener('click', e => {
		if (e.target === imgdiv) imgdiv.style.display = 'none';
	});

	// --- 4. Plus va Minus (Hisoblagich + Narx o'zgarishi) ---
	plusBtn.addEventListener('click', () => {
		currentCount++;
		countspan.textContent = currentCount;
		updateProductPriceDisplay();
	});

	minusBtn.addEventListener('click', () => {
		if (currentCount > 0) {
			currentCount--;
			countspan.textContent = currentCount;
			updateProductPriceDisplay();
		}
	});

	// --- 5. Savatcha oynasi (Toggle) ---
	cartIcon.addEventListener('click', e => {
		e.stopPropagation();
		cartBox.style.display = cartBox.style.display === 'block' ? 'none' : 'block';
	});

	document.addEventListener('click', e => {
		if (!cartBox.contains(e.target) && e.target !== cartIcon) {
			cartBox.style.display = 'none';
		}
	});

	// --- 6. Savatchaga qo'shish ---
	addToCartBtn.addEventListener('click', () => {
		if (currentCount === 0) {
			alert('Iltimos, avval miqdorni tanlang!');
			return;
		}

		cartCount += currentCount;
		updateCartUI();

		// Qo'shilgandan keyin holatni reset qilish
		currentCount = 0;
		countspan.textContent = 0;
		updateProductPriceDisplay(); // Narx ko'rsatkichini dastlabki holatga qaytarish
		cartBox.style.display = 'block';
	});

	function updateCartUI() {
		if (cartCount > 0) {
			badge.textContent = cartCount;
			badge.style.display = 'block';

			const totalPrice = (singleProductPrice * cartCount).toFixed(2);
			cartContent.innerHTML = `
        <div class="cart__product">
          <img class="cart__product__img" src="${imagesArray[0]}" alt="sneakers">
          <div class="cart__product__info">
            <p>${productName}</p>
            <span>$${singleProductPrice.toFixed(2)} x ${cartCount} <b>$${totalPrice}</b></span>
          </div>
          <img class="delete" src="image/musr.svg" alt="">
        </div>
        <button class="check__btn">Checkout</button>
      `;

			cartContent.querySelector('.delete').addEventListener('click', () => {
				cartCount = 0;
				updateCartUI();
			});
		} else {
			badge.style.display = 'none';
			cartContent.innerHTML = `<div class="div__your">Your cart is empty.</div>`;
		}
	}

	// --- 7. Mobil Menyu ---
	if (menuBtn && closeBtn) {
		menuBtn.addEventListener('click', () => headerList.classList.add('active'));
		closeBtn.addEventListener('click', () => headerList.classList.remove('active'));
	}
});
