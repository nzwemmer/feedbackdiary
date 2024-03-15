<div class="form-inner">
    <h1 id="diary_status"></h1>
    <h1><i class="fa-solid fa-clock"></i> Entry timestamp? <span class="new-feature-icon"> new! </span><span style="text-align: right; font-size: 18px" id="countdown"></span></h1>
    <input type="text" id="dateInput" name="selectedDate" readonly="readonly" />
    <h1><i class="fa-solid fa-thumbs-up successLogo icon-outline"></i> What went well today?</h1>
    <textarea id="message_positive" name="message_positive" placeholder="Message..." rows="5"></textarea>
    <h1><i class="fa-solid fa-thumbs-down errorLogo icon-outline"></i> What did not go well today?</h1>
    <textarea id="message_negative" name="message_negative" placeholder="Message..." rows="5"></textarea>
    <h1><i class="fa-solid fa-circle-question"></i> Additional remarks?</h1>
    <textarea id="message_additional" name="message_additional" placeholder="Message (optional)..." rows="5"></textarea>
    <h1><i class="fa-regular fa-face-laugh-wink emotion"></i> How did you feel today?</h1>
    <div class="sentiment-buttons" id="message_sentiment">
    <button type="button" class="sentiment-button" onclick="updateSentiment(-2)">
      <i class="fa-regular fa-face-angry"></i>
    </button>
    <button type="button" class="sentiment-button" onclick="updateSentiment(-1)">
      <i class="far fa-frown"></i>
    </button>
    <button type="button" class="sentiment-button active-0" onclick="updateSentiment(0)">
      <i class="far fa-meh"></i>
    </button>
    <button type="button" class="sentiment-button" onclick="updateSentiment(1)">
      <i class="far fa-smile"></i>
    </button>
    <button type="button" class="sentiment-button" onclick="updateSentiment(2)">
      <i class="fa-regular fa-face-laugh-beam"></i>
    </button>
    <input type="hidden" id="selected-sentiment" name="sentiment" value="">
  </div>
    <button type="submit" class="neutral">Submit</button>
</div>

<script src="assets/js/updateSentiment.js"></script>