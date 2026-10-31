/* =========================================================
   Anwar Al-Asfar — Landing Page Scripts
   Vanilla JavaScript
   ========================================================= */
(function () {
    'use strict';

    /* ---------------------------------------------------------
       1) Floating WhatsApp Button
       يظهر بعد النزول لأسفل الصفحة (بعد الـ Hero تقريباً)
    --------------------------------------------------------- */
    const whatsappFloat = document.getElementById('whatsappFloat');
    const heroSection = document.querySelector('.hero');

    if (whatsappFloat && heroSection) {
        const toggleFloat = () => {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (window.scrollY > heroBottom - 100) {
                whatsappFloat.classList.add('is-visible');
            } else {
                whatsappFloat.classList.remove('is-visible');
            }
        };

        window.addEventListener('scroll', toggleFloat, { passive: true });
        // تشغيل أولي عند التحميل
        toggleFloat();
    }

    /* ---------------------------------------------------------
       2) نموذج الحجز — تحقق وإرسال
    --------------------------------------------------------- */
    const form = document.getElementById('bookingForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const successBox = document.getElementById('formSuccess');

    const setError = (input, errorEl, message) => {
        input.classList.add('is-invalid');
        errorEl.textContent = message;
    };

    const clearError = (input, errorEl) => {
        input.classList.remove('is-invalid');
        errorEl.textContent = '';
    };

    const validateName = () => {
        const value = nameInput.value.trim();
        if (value.length < 3) {
            setError(nameInput, nameError, 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل)');
            return false;
        }
        clearError(nameInput, nameError);
        return true;
    };

    const validatePhone = () => {
        const value = phoneInput.value.trim();
        // يقبل صيغ مثل: 05xxxxxxxx أو +966xxxxxxxxx
        const phoneRegex = /^(\+?\d{8,15})$/;
        if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
            setError(phoneInput, phoneError, 'يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل)');
            return false;
        }
        clearError(phoneInput, phoneError);
        return true;
    };

    if (form) {
        // تحقق لحظي عند الخروج من الحقل
        nameInput.addEventListener('blur', validateName);
        phoneInput.addEventListener('blur', validatePhone);

        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('is-invalid')) validateName();
        });
        phoneInput.addEventListener('input', () => {
            if (phoneInput.classList.contains('is-invalid')) validatePhone();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();

            if (!isNameValid || !isPhoneValid) return;

            // هنا يمكن إرسال البيانات لخادم أو واتساب
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();

            // خيار: تحويل الطلب إلى واتساب مباشرة
            const waMessage = encodeURIComponent(
                `السلام عليكم،\nأرغب بحجز مقعد في رحلة عمرة رمضان المتميزة.\n\nالاسم: ${name}\nرقم الهاتف: ${phone}`
            );
            const waURL = `https://wa.me/966500000000?text=${waMessage}`;

            // إظهار رسالة النجاح
            form.hidden = true;
            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // فتح واتساب بعد لحظة قصيرة
            setTimeout(() => {
                window.open(waURL, '_blank', 'noopener');
            }, 900);

            // (اختياري) إعادة تعيين النموذج بعد فترة
            setTimeout(() => {
                form.reset();
                form.hidden = false;
                if (successBox) successBox.hidden = true;
            }, 8000);
        });
    }

    /* ---------------------------------------------------------
       3) حركة ظهور تدريجي عند التمرير (IntersectionObserver)
    --------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.feature-card, .timeline__item, .cta__card'
    );

    if ('IntersectionObserver' in window && revealTargets.length) {
        revealTargets.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealTargets.forEach((el) => observer.observe(el));
    }
})();
