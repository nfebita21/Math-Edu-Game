import mainQuiz from "./main-quiz";
import actions from "./tutorial-actions";

const tutorialData = {
  city01: {
    1: { // Level 1
      1: [ // Step 1
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => setTimeout(() => actions.focus(next, ['.gl-progress-bar']), 3000) },
        { action: (next) => setTimeout(() => actions.showGuide(next, '.gl-progress-bar', 'Kemajuan game akan ditampilkan di bar ini. Kamu diminta mengumpulkan air agar tanaman bisa tumbuh dengan sempurna. <br> Air didapat dari menjawab soal dengan benar.', ['0', 'unset']), 1000) },
        { action: (next) => actions.showGuide(next, '.gl-progress-bar', 'Lingkaran biru sebagai simbol posisimu saat ini', ['unset', '0']) },
        { action: (next) => actions.focus(next, ['.main-quiz']) },
        { action: (next) => setTimeout(() => actions.showGuide(next, '.main-quiz', 'Soal kuis utama. Baca dan pahami sebelum mengerjakan!', ['0', 'unset']), 1000) },
        { action: (next) => actions.focus(next, ['.sub-quiz']) },
        { action: (next) => setTimeout(() => actions.showGuide(next, '.sub-quiz', 'Kerjakan langkah demi langkah step kuis!', ['0', 'unset']), 1000) },
        { action: (next) => actions.showPrecisWrapper(next) },
        { action: (next) => actions.focus(next, ['.precis-wrapper']) },
        { action: (next) => setTimeout(() => actions.highlight(next, '.known', 0), 1000) },
        { action: (next) => {
          const quiz = mainQuiz.find(quiz => quiz.id === 1);
          setTimeout(() => actions.showPrecis(next, quiz.precis[0]), 1000); 
        } },
        { action: (next) => setTimeout(() => actions.highlight(next, '.known', 1), 2000) },
        { action: (next) => {
          const quiz = mainQuiz.find(quiz => quiz.id === 1);
          setTimeout(() => actions.showPrecis(next, quiz.precis[1]), 1000); 
        } },
        { action: (next) => setTimeout(() => actions.showGuide(next, '.precis-wrapper', 'Ambil informasi penting dari soal.', ['unset', '0']), 1000) },
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => actions.unfocus(next) },
        { action: (next) => setTimeout(() => actions.showPointer(next, '.btn-fraction', 'Aktifkan mode pecahan', true), 2000) },
        { action: (next) => actions.removeElement(next, ['.tutorial-instruction']) },
        { action: (next) => actions.showPointer(next, '2', 'Masukkan angka perkalian') },
        { action: (next) => actions.showPointer(next, '.first-fraction__denominator') },
        { action: (next) => actions.showPointer(next, '3') },
        { action: (next) => actions.showPointer(next, '.second-number') },
        { action: (next) => actions.showPointer(next, '5') },
        { action: (next) => actions.removeElement(next, ['.tutorial-instruction']) },
        { action: (next) => actions.showPointer(next, '.btn-submit-result__container', 'Submit Jawaban') },
      ],
      2: [
        { action: (next) => actions.removeHighlight(next) },
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => actions.focus(next, ['.gl-progress-bar .gl-minor-progress']) },
        { action: (next) => actions.showGuide(next, '.gl-minor-progress', 'Jawabanmu benar! Air didapat dan tingkat tanaman bertambah! ^_^', ['unset', '0']) },
        { action: (next) => actions.focus(next, ['.gl-progress-bar', '.main-quiz', '.sub-quiz']) },
        { action: (next) => actions.focus(next, ['.multiplication-pair']) },
        { action: (next) => setTimeout(() => actions.showArrowMultiplication(next, 'top'), 2000) },
        { action: (next) => setTimeout(() => actions.showClue(next, 'Kalikan angka bagian atas <span class="multiplication">2 x 5 = 10</span>', '.result .calc-input', ['unset', '100%']), 1000) },
        { action: (next) => setTimeout(() => actions.showGuide(next, '.tutorial-clue', 'Perhatikan cara mengerjakannya.', ['unset', '0']), 2000) },
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => setTimeout(() => actions.showPointer(next, '1', 'Masukkan angka hasil', true), 1000)},
        { action: (next) => actions.showPointer(next, '0')},
        { action: (next) => actions.removeElement(next, ['.tutorial-clue', '.curved-line', '.tutorial-instruction']) },
        { action: (next) => setTimeout(() => actions.showClue(next, 'Berikan angka pembilang ke hasil', '.result .calc-input', ['unset', '100%']), 1000) },
        { action: (next) => actions.showArrowMultiplication(next, 'bottom') },
        { action: (next) => actions.showPointer(next, '.first-fraction__denominator') },
        { action: (next) => actions.showPointer(next, '3') },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue', '.right-arrow_multiplication', '.tutorial-instruction']) },
        { action: (next) => actions.showPointer(next, '.btn-submit-result__container', 'Submit Jawaban') },
      ],
      3: [
        { action: (next) => actions.unfocus(next) },
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => actions.focus(next, ['.sub-quiz', '.fraction.result']) },
        { action: (next) => setTimeout(() => actions.showClue(next, 'Pecahan bisa disederhanakan jika pembilang dan penyebutnya bisa dibagi dengan angka yang sama (FPB > 1), kalau tidak, pecahan itu sudah paling sederhana. ', '.result', ['unset', '50px']), 2000) },
        { action: (next) => actions.addBtnNext(next, '.tutorial-clue') },
        { action: (next) => actions.showClue(next, '10 dan 3 tidak dapat dibagi dengan angka yang sama (lebih dari 1), <u>maka tidak bisa disederhanakan lagi.</u>', '.result', ['85px', '-60px']) },
        { action: (next) => actions.addBtnNext(next, '.tutorial-clue:last-child') },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue:first-child', '.tutorial-clue:last-child']) },
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => actions.showPointer(next, '.answer-choices .no', 'Pilih jawaban yang tepat.') }
      ],
      5: [
        { action: (next) => actions.toggleOverlay(next) },
        { action: (next) => actions.focus(next, ['.fraction.result', '.item-name']) },
        { action: (next) => setTimeout(() => actions.showClue(next, 'Misalkan setiap keranjang buah terbagi 3 bagian yang sama.', '.result', ['0', '60px']), 2000) },
        { action: (next) => setTimeout(() => actions.showClue(next, 'Kamu memiliki buah-buahan yang bisa mengisi 10 bagian keranjang.', '.result', ['100px', '70px']), 2000) },
        { action: (next) => actions.addBtnNext(next, '.tutorial-clue:last-child', 'Lanjut') },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue__wrapper']) },
        { action: (next) => actions.showClue(next, 'Karena setiap keranjang hanya bisa menampung 3 bagian, maka jumlah keranjang yang dibutuhkan yaitu:', '.result', ['0', '60px']) },
        { action: (next) => actions.addBtnNext(next, '.tutorial-clue:last-child', 'Lanjut') },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue__wrapper']) },
        { action: (next) => actions.showClue(next, '&#8226; 3 keranjang buah = 9 bagian keranjang (penuh)', '.result', ['0', '60px']) },
        { action: (next) => setTimeout(() => actions.showIllustrationContainer(next), 1500) },
        { action: (next) => setTimeout(() => actions.addItemToContainer(next, '.illustration-container', '<img src="./illustrations-quiz/gl-il-1.png">'), 1500) },
        { action: (next) => setTimeout(() => actions.addItemToContainer(next, '.illustration-container', '<img src="./illustrations-quiz/gl-il-1.png">'), 1000) },
        { action: (next) => setTimeout(() => actions.addItemToContainer(next, '.illustration-container', '<img src="./illustrations-quiz/gl-il-1.png">'), 1000) },
        { action: (next) => setTimeout(() => actions.showClue(next, '&#8226; 1 keranjang buah = 1 bagian keranjang (tidak penuh)', '.result', ['90px', '70px']), 3000) },
        { action: (next) => setTimeout(() => actions.addItemToContainer(next, '.illustration-container', '<img src="./illustrations-quiz/gl-il-2.png">'), 1500) },
        { action: (next) => setTimeout(() => actions.addBtnNext(next, '.tutorial-clue:last-child', 'Lanjut') , 1000) },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue__wrapper']) },
        { action: (next) => actions.showClue(next, 'Jadi, 10/3 = 3 keranjang penuh dan 1/3 keranjang terisi sebagian.', '.result', ['0', '60px']) },
        { action: (next) => setTimeout(() => actions.addBtnNext(next, '.tutorial-clue:last-child') , 1000) },
        { action: (next) => actions.removeElement(next, ['.tutorial-clue__wrapper', '.illustration-container']) },
        { action: (next) => actions.unfocus(next, ['.fraction.result', '.item-name']) },
        { action: (next) => actions.focus(next, ['.open-image-btn']) },
        { action: (next) => actions.showPointer(next, '.open-image-btn', 'Klik kaca pembesar untuk melihat gambar ukuran penuh') },
        { action: (next) => actions.hideElement(next, '#imageModal .close-btn') },
        { action: (next) => setTimeout(() => actions.showDialog(next, '.modal-content', 'Apakah ilustrasi ini menggambarkan 10/3 keranjang buah?', 'top'), 1500) },
        { action: (next) => setTimeout(() => actions.showDialog(next, '.modal-content', 'Mari kita cek bersama!', 'bottom'), 2000) },
        { action: (next) => setTimeout(() => actions.addBtnNext(next, '.dialog-tutorial.bottom', 'Oke, mulai!'), 1500) },
        { action: (next) => actions.addOverlay(next, '.modal-content') },
        { action: (next) => actions.showAllElementsGradually(next, '.number-counter span:not(.empty)') },
        { action: (next) => setTimeout(() => actions.showDialog(next, '.modal-content', 'Ilustrasi di atas menunjukkan 11 bagian keranjang yang setiap keranjangnya berisi 3 bagian. Dalam bentuk pecahan menjadi 11/3 keranjang buah.', 'bottom'), 1500) },
        { action: (next) => setTimeout(() => actions.showArrowNextBtn(next, '.dialog-tutorial.bottom'), 2000) }
      ]
    },
  }
}

export default tutorialData;