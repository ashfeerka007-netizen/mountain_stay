/**
 * Mountain Stay Retreat - Interactive JavaScript Application
 * Wayanad District Police Co-operative Society Ltd. No. W 208
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside or on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Room Category Filter Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const roomCards = document.querySelectorAll('.room-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'dormitory' && category.includes('dormitory'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Set Default Dates (Today & Tomorrow)
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  const quickCheckin = document.getElementById('quickCheckin');
  const quickCheckout = document.getElementById('quickCheckout');

  if (checkinInput) {
    checkinInput.min = formatDate(today);
    checkinInput.value = formatDate(today);
  }
  if (checkoutInput) {
    checkoutInput.min = formatDate(tomorrow);
    checkoutInput.value = formatDate(tomorrow);
  }
  if (quickCheckin) {
    quickCheckin.min = formatDate(today);
    quickCheckin.value = formatDate(today);
  }
  if (quickCheckout) {
    quickCheckout.min = formatDate(tomorrow);
    quickCheckout.value = formatDate(tomorrow);
  }

  // 4. Booking Summary & WhatsApp Message Generator
  const bookingForm = document.getElementById('retreatBookingForm');
  const summaryRoomType = document.getElementById('summaryRoomType');
  const summaryDates = document.getElementById('summaryDates');
  const summaryGuests = document.getElementById('summaryGuests');
  const summaryNights = document.getElementById('summaryNights');
  const summaryCategory = document.getElementById('summaryCategory');

  function updateBookingSummary() {
    if (!bookingForm) return;

    const roomSelect = document.getElementById('roomTypeSelect');
    const checkin = document.getElementById('checkinDate')?.value;
    const checkout = document.getElementById('checkoutDate')?.value;
    const guests = document.getElementById('guestCount')?.value || '1 Guest';
    const affiliation = document.getElementById('affiliationType')?.value || 'Police Member';

    if (summaryRoomType && roomSelect) {
      summaryRoomType.textContent = roomSelect.options[roomSelect.selectedIndex]?.text || 'Executive Suite Room';
    }
    if (summaryDates && checkin && checkout) {
      summaryDates.textContent = `${checkin} to ${checkout}`;
      
      const d1 = new Date(checkin);
      const d2 = new Date(checkout);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      if (summaryNights) {
        summaryNights.textContent = `${diffDays} Night${diffDays > 1 ? 's' : ''}`;
      }
    }
    if (summaryGuests) summaryGuests.textContent = guests;
    if (summaryCategory) summaryCategory.textContent = affiliation;
  }

  // Bind change events
  const bookingInputs = ['roomTypeSelect', 'checkinDate', 'checkoutDate', 'guestCount', 'affiliationType'];
  bookingInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateBookingSummary);
  });

  // Initial summary update
  updateBookingSummary();

  // Quick form submission -> scrolls to main form & syncs
  const quickForm = document.getElementById('quickBookingForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const qRoom = document.getElementById('quickRoomType')?.value;
      const qIn = document.getElementById('quickCheckin')?.value;
      const qOut = document.getElementById('quickCheckout')?.value;

      if (qRoom && document.getElementById('roomTypeSelect')) {
        document.getElementById('roomTypeSelect').value = qRoom;
      }
      if (qIn && document.getElementById('checkinDate')) {
        document.getElementById('checkinDate').value = qIn;
      }
      if (qOut && document.getElementById('checkoutDate')) {
        document.getElementById('checkoutDate').value = qOut;
      }
      updateBookingSummary();

      const reservationSection = document.getElementById('reservation');
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Full form submission -> triggers WhatsApp reservation with prefilled message
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('guestName')?.value || 'Guest';
      const phone = document.getElementById('guestPhone')?.value || 'Not provided';
      const idProof = document.getElementById('guestIdType')?.value || 'Police ID';
      const memberId = document.getElementById('guestMemberId')?.value || 'N/A';
      const roomSelect = document.getElementById('roomTypeSelect');
      const roomName = roomSelect?.options[roomSelect.selectedIndex]?.text || 'Suite Room';
      const checkin = document.getElementById('checkinDate')?.value || '';
      const checkout = document.getElementById('checkoutDate')?.value || '';
      const guests = document.getElementById('guestCount')?.value || '1';
      const affiliation = document.getElementById('affiliationType')?.value || 'Police Member';
      const notes = document.getElementById('guestNotes')?.value || 'None';

      const message = `*MOUNTAIN STAY RETREAT - BOOKING ENQUIRY*%0A` +
        `----------------------------------------%0A` +
        `*Guest Name:* ${encodeURIComponent(fullName)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Affiliation:* ${encodeURIComponent(affiliation)}%0A` +
        `*ID Type / Number:* ${encodeURIComponent(idProof)} (No: ${encodeURIComponent(memberId)})%0A` +
        `*Room Requested:* ${encodeURIComponent(roomName)}%0A` +
        `*Check-in:* ${encodeURIComponent(checkin)}%0A` +
        `*Check-out:* ${encodeURIComponent(checkout)}%0A` +
        `*Guests:* ${encodeURIComponent(guests)}%0A` +
        `*Special Requests:* ${encodeURIComponent(notes)}%0A` +
        `----------------------------------------%0A` +
        `_Sent via Mountain Stay Retreat Official Portal (WDPCS Wayanad)_`;

      const whatsappUrl = `https://wa.me/918301995940?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Lightbox Modal for Official Graphic / Brochure
  const zoomTrigger = document.getElementById('brochureZoomTrigger');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');

  if (zoomTrigger && lightboxModal) {
    zoomTrigger.addEventListener('click', () => {
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 7. Quick Book Buttons inside Room Cards
  document.querySelectorAll('.book-room-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRoom = btn.getAttribute('data-room');
      const select = document.getElementById('roomTypeSelect');
      if (select && targetRoom) {
        select.value = targetRoom;
        updateBookingSummary();
      }
      const reservationSection = document.getElementById('reservation');
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
