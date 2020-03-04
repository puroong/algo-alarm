import TimeFormatter from "../utils/timeFormatter";
import Contest from "../dtos/contest";

class ComingContestNodeFactory {
    private constructor() {

    }

    static create(contest: Contest) {
        const node = document.createElement('div');
        node.classList.add('wrapper');

        let iconWrapper = document.createElement('div');
        iconWrapper.classList.add('wrap');

        let iconImg = document.createElement('img');
        iconImg.classList.add('icon');
        iconImg.src = chrome.runtime.getURL(`images/logo/${contest.siteName}.png`);
        iconImg.onclick = function () {
            chrome.tabs.update({ url: contest.siteUrl });
        }

        let textWrapper = document.createElement('div');
        textWrapper.classList.add('wrap');

        let titleText = document.createElement('p');
        titleText.classList.add('title');
        titleText.textContent = contest.name;

        let beginAtText = document.createElement('p');
        beginAtText.classList.add('beginAt');
        beginAtText.textContent = TimeFormatter.beginAt2Readable(contest.beginAt);

        let untilText = document.createElement('p');
        untilText.classList.add('until');
        untilText.setAttribute('data-contestname', contest.name);
        untilText.textContent = TimeFormatter.until2Readable(contest.beginAt - Date.now());

        let durationText = document.createElement('p');
        durationText.classList.add('duration');
        durationText.textContent = TimeFormatter.duration2Readable(contest.duration);

        iconWrapper.appendChild(iconImg);

        textWrapper.appendChild(titleText);
        textWrapper.appendChild(beginAtText);
        textWrapper.appendChild(untilText);
        textWrapper.appendChild(durationText);

        node.appendChild(iconWrapper);
        node.appendChild(textWrapper);

        return node;
    }
}

export default ComingContestNodeFactory;