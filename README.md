# ⌨️ Typing Mania : The Accuracy Challenge

![Cover](https://raw.githubusercontent.com/Pansther/typing-mania/refs/heads/main/public/cover.png)

🎮 Play : [https://pansther.itch.io/typing-mania](https://pansther.itch.io/typing-mania)

## 🇬🇧 English

### Overview

Typing Mania is an English typing practice game that focuses on accuracy and speed to build combos and earn scores. Players must correctly type the words that appear on the screen. Making a mistake will result in a loss of health and a combo reset.

### Technologies Used 💻

This game is developed using a modern technology stack to deliver a fast and performant web gaming experience:

- **Phaser JS:** Used as the primary framework for handling game logic, movement, and graphic rendering.
- **React:** Used for building the surrounding User Interface (UI) elements, such as the menu screens, settings, and displaying the score/lives outside the core game canvas.
- **TypeScript:** Utilized for both the game and UI code, providing type safety and helping to minimize development errors.

### Game Rules

1. **Scoring and Combo:**
    - Type words correctly to increase the **Combo** and gain **Score**.
    - **Score Calculation Formula:**
      The score gained is calculated using the formula:
      `Score Gained = (text.length x (1 + fallspeedMultiply x 2) x bonus) + comboBonus`
      Where:
        - `text.length` is the length of the typed word.
        - `fallspeedMultiply` is the word fall speed multiplier (which might increase over time or with difficulty).
        - `bonus` is the difficulty's score bonus (as defined in the table below).
        - `comboBonus` is the bonus score derived from the current **Combo** value.
    - **Combo** increases with every consecutive correct word.
2. **Mistakes and Lives:**
    - If a typing mistake is made (**Mistake**):
        - **Life** is reduced by 1.
        - **Combo** is reset to 0.
    - **Starting Lives:** 5 lives.
    - **Life Up:** An extra life is gained when the score reaches a predetermined threshold (**lifeUpScore**).
    - **Maximum Lives:** 7 lives.
    - **Game Over:** When lives reach 0.

### Difficulty Settings (DIFFICULTY)

The game features 4 difficulty levels, each setting different conditions for word appearance rate (WPM) and score bonuses:

| Difficulty Level | WPM (Words Per Minute) | Score Bonus Per Word (bonus) | Max Word Length (maxWordLen) | Score Threshold for Extra Life (lifeUpScore) |
| :--------------- | :--------------------- | :--------------------------- | :--------------------------- | :------------------------------------------- |
| **Easy**         | 10                     | 1                            | 4                            | 250                                          |
| **Normal**       | 15                     | 1                            | 6                            | 500                                          |
| **Hard**         | 30                     | 2                            | 8                            | 1000                                         |
| **Mania**        | 40                     | 3                            | Unlimited (999)              | 2000                                         |

---

## 🇹🇭 ภาษาไทย

### ภาพรวม

Typing Mania เป็นเกมฝึกพิมพ์ภาษาอังกฤษที่เน้นความแม่นยำและความเร็วในการพิมพ์เพื่อสร้างคอมโบและทำคะแนน ผู้เล่นจะต้องพิมพ์คำที่ปรากฏบนหน้าจอให้ถูกต้อง หากพิมพ์ผิดจะสูญเสียหัวใจและคอมโบจะถูกรีเซ็ต

### เทคโนโลยีที่ใช้ 💻

เกมนี้พัฒนาโดยใช้ชุดเครื่องมือสมัยใหม่เพื่อมอบประสบการณ์การเล่นเกมบนเว็บที่รวดเร็วและมีประสิทธิภาพ:

- **Phaser JS:** ใช้เป็นเฟรมเวิร์กหลักในการจัดการตรรกะของเกม (Game Logic), การเคลื่อนไหว (Movement), และการเรนเดอร์กราฟิก
- **React:** ใช้สำหรับสร้างส่วนต่อประสานกับผู้ใช้ (User Interface) นอกเหนือจากตัวเกมหลัก เช่น หน้าจอเมนู, การตั้งค่า, และการแสดงผลคะแนน/หัวใจ
- **TypeScript:** ใช้สำหรับโค้ดทั้งฝั่งเกมและ UI เพื่อให้โค้ดมีชนิดข้อมูลที่ชัดเจน (Type Safety) และช่วยลดข้อผิดพลาดในการพัฒนา

### กฎของเกม

1. **การทำคะแนนและคอมโบ:**
    - พิมพ์คำให้ถูกต้องเพื่อเพิ่ม **คอมโบ** และเก็บ **คะแนน**
    - **สูตรการคิดคะแนน:**
      คะแนนที่ได้รับจะคำนวณตามสูตร:
      `Score Gained = (text.length x (1 + fallspeedMultiply x 2) x bonus) + comboBonus`
      โดยที่:
        - `text.length` คือ ความยาวของคำที่พิมพ์
        - `fallspeedMultiply` คือ ตัวคูณความเร็วในการตกของคำ (อาจเพิ่มขึ้นตามเวลาหรือความยาก)
        - `bonus` คือ โบนัสคะแนนของระดับความยาก (จากตารางด้านล่าง)
        - `comboBonus` คือ คะแนนโบนัสที่ได้จากค่า **Combo** ปัจจุบัน
    - **คอมโบ** จะเพิ่มขึ้นทุกครั้งที่พิมพ์ถูกต้องต่อเนื่อง
2. **ความผิดพลาดและหัวใจ:**
    - หากพิมพ์ผิด:
        - **หัวใจ** จะลดลง 1 ดวง
        - **คอมโบ** จะถูกรีเซ็ตเป็น 0
    - **หัวใจเริ่มต้น:** 5 ดวง
    - **การเพิ่มหัวใจ:** เมื่อทำคะแนนถึงเกณฑ์ที่กำหนด (**lifeUpScore**) จะได้รับหัวใจเพิ่ม 1 ดวง
    - **หัวใจสูงสุด:** 7 ดวง
    - **Game Over:** เมื่อหัวใจเหลือ 0

### การตั้งค่าความยาก (DIFFICULTY)

เกมมี 4 ระดับความยาก โดยแต่ละระดับจะกำหนดเงื่อนไขความเร็วในการปรากฏคำ (WPM) และโบนัสคะแนนที่แตกต่างกัน:

| ระดับความยาก | WPM (คำต่อนาที) | โบนัสคะแนนต่อคำ (bonus) | ความยาวคำสูงสุด (maxWordLen) | คะแนนที่ต้องทำได้เพื่อเพิ่มหัวใจ (lifeUpScore) |
| :----------- | :-------------- | :---------------------- | :--------------------------- | :--------------------------------------------- |
| **Easy**     | 10              | 1                       | 4                            | 250                                            |
| **Normal**   | 15              | 1                       | 6                            | 500                                            |
| **Hard**     | 30              | 2                       | 8                            | 1000                                           |
| **Mania**    | 40              | 3                       | ไม่จำกัด (999)               | 2000                                           |

---

DEV: โปรเจ็คนี้เป็นการทดลองใช้ Phaser.js เป็นครั้งแรกเพื่อทำเกมง่าย ๆ ขึ้นมา โดยเน้นเขียนง่ายเป็นหลัก ไม่ได้มีการ Optimize หรือ Refactor ให้อ่านง่ายขึ้น ลองเล่นให้สนุกนะครับ 😁
