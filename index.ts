const getTweetButton = () => document.querySelector<HTMLDivElement>('[data-testid="tweetButton"]');
const getAddTweetButton = () => document.querySelector<HTMLDivElement>('[aria-label="Add Tweet"]');
const getTweetDrafts = () => document.querySelectorAll<HTMLDivElement>('[role="dialog"] [aria-label="Tweet text"]');

let isCurrentlyPasting = false;
let pastingDraftIndex = 0;
let savedDraftData: string[] = [];

const rightClickHandler = (e: MouseEvent) => {
  if (!getTweetButton()?.contains(e.target as Node)) return;

  e.preventDefault();

  if (e.shiftKey) {
    // load tweets
    console.log("load tweets");
    const rawData = localStorage.getItem(":sgunter:thread");
    if (rawData) {
      try {
        savedDraftData = JSON.parse(rawData);
      } catch {}
    }

    if (!savedDraftData) {
      alert("No thread saved or thread corrupted");
      return;
    }

    isCurrentlyPasting = true;
    pastingDraftIndex = 0;
    navigator.clipboard.writeText(savedDraftData[pastingDraftIndex]);
  } else {
    // save tweets
    console.log("save tweets");
    const draftElements = Array.from(getTweetDrafts());
    const draftContents = draftElements.map((draft) => draft.innerText.trim().replaceAll("\n\n", "\n")).filter(Boolean);
    localStorage.setItem(":sgunter:thread", JSON.stringify(draftContents));
  }
};

const pasteHandler = async () => {
  if (!isCurrentlyPasting) return;
  if (!savedDraftData.includes(await navigator.clipboard.readText())) {
    isCurrentlyPasting = false;
    return;
  }
  pastingDraftIndex++;
  if (pastingDraftIndex >= savedDraftData.length) {
    navigator.clipboard.writeText("");
    isCurrentlyPasting = false;
    return;
  }
  getAddTweetButton()?.focus();
  navigator.clipboard.writeText(savedDraftData[pastingDraftIndex]);
};

window.addEventListener("contextmenu", rightClickHandler);
window.addEventListener("paste", pasteHandler);

(window as any).s = {
  getAddTweetButton,
  getTweetButton,
  getTweetDrafts,
};
