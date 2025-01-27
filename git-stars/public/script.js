document.addEventListener('DOMContentLoaded', () => {
    const reposByStarsList = document.getElementById('repos-by-stars');
    const reposByFollowersList = document.getElementById('repos-by-followers');
    let initialStarsRepos = [];
    let initialFollowersRepos = [];

    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted!');
            } else if (permission === 'denied') {
                console.log('Notification permission denied!');
            } else if (permission === 'default') {
                console.log('Notification permission still in default state (not granted or denied).');
            }
        });
    }

    async function fetchTopRepos() {
        try {
            const starsResponse = await fetch('https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10');
            const starsData = await starsResponse.json();
            displayRepos(starsData.items, reposByStarsList, 'stars');
            initialStarsRepos = starsData.items.map(repo => ({ fullName: repo.full_name, stars: repo.stargazers_count }));

            const followersResponse = await fetch('https://api.github.com/search/repositories?q=followers:>1&sort=followers&order=desc&per_page=10');
            const followersData = await followersResponse.json();
            const sortedByFollowers = followersData.items.sort((a, b) => b.watchers_count - a.watchers_count).slice(0, 10);
            displayRepos(sortedByFollowers, reposByFollowersList, 'followers');
            initialFollowersRepos = sortedByFollowers.map(repo => ({ fullName: repo.full_name, followers: repo.watchers_count }));

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayRepos(repos, listElement, type) {
        listElement.innerHTML = '';
        repos.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.full_name}</a> - ${type}: ${type === 'stars' ? repo.stargazers_count : repo.watchers_count}`;
            listElement.appendChild(listItem);
        });
    }

    function checkForUpdates() {
        fetchTopReposForUpdateCheck().then(updatedData => {
            if (updatedData) {
                updatedData.starsUpdates.forEach(update => {
                    showNotification('Star Repo Update', `Stars updated for ${update.fullName}!`);
                });
                updatedData.followersUpdates.forEach(update => {
                    showNotification('Follower Repo Update', `Followers updated for ${update.fullName}!`);
                });
            }
        });
    }

    async function fetchTopReposForUpdateCheck() {
        try {
            const starsResponse = await fetch('https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10');
            const starsData = await starsResponse.json();
            const currentStarsRepos = starsData.items.map(repo => ({ fullName: repo.full_name, stars: repo.stargazers_count }));

            const followersResponse = await fetch('https://api.github.com/search/repositories?q=followers:>1&sort=followers&order=desc&per_page=10');
            const followersData = await followersResponse.json();
            const currentFollowersRepos = followersData.items.sort((a, b) => b.watchers_count - a.watchers_count).slice(0, 10).map(repo => ({ fullName: repo.full_name, followers: repo.watchers_count }));

            const updates = compareRepos(currentStarsRepos, currentFollowersRepos);
            return updates;

        } catch (error) {
            console.error('Error fetching data for update check:', error);
            return null;
        }
    }

    function compareRepos(currentStarsRepos, currentFollowersRepos) {
        const starsUpdates = [];
        const followersUpdates = [];

        currentStarsRepos.forEach((currentRepo, index) => {
            const initialRepo = initialStarsRepos[index];
            if (initialRepo && currentRepo.stars !== initialRepo.stars) {
                starsUpdates.push({ fullName: currentRepo.fullName });
            }
        });

        currentFollowersRepos.forEach((currentRepo, index) => {
            const initialRepo = initialFollowersRepos[index];
            if (initialRepo && currentRepo.followers !== initialRepo.followers) {
                followersUpdates.push({ fullName: currentRepo.fullName });
            }
        });
        return { starsUpdates, followersUpdates };
    }

        fetchTopRepos();
        checkForUpdates();
        setInterval(checkForUpdates, 300000);
    });

function testNotification() {
    showNotification('Test Notification', 'This is a test notification from your GitHub repo tracker!');
}

function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body, // Explicitly set the body
            icon: './github-mark-white.png' // A cute kitten icon, just for fun!
        });
    }
}
