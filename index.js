import Web3 from 'web3'
window.web3 = new Web3(window.web3 ? window.web3.currentProvider : new Web3.providers.HttpProvider('https://ropsten.infura.io'))

const contractABI = [Your-JSON-ABI]
const contractAddress = '0xdde6c125e7ff8901122771dfde0533b8c23dbbdd'
const contractInstance = web3.eth.contract(contractABI).at(contractAddress)

const contractABI = [{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"followUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_occupation","type":"bytes32"},{"name":"_bio","type":"string"}],"name":"setProfile","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"unfollowUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_content","type":"string"}],"name":"writeMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"messages","outputs":[{"name":"content","type":"string"},{"name":"writtenBy","type":"address"},{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"userFollowers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userInfo","outputs":[{"name":"name","type":"bytes32"},{"name":"occupation","type":"bytes32"},{"name":"bio","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"userMessages","outputs":[{"name":"content","type":"string"},{"name":"writtenBy","type":"address"},{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]



function initMyProfile() {
    contractInstance.userInfo(web3.eth.accounts[0], (err, myProfile) => {
        if(err) return alert(err)
        
        let profileContent = ''
        myName = web3.toUtf8(myProfile[0])
        let myOccupation = web3.toUtf8(myProfile[1])
        let myBio = myProfile[2]

profileContent += `
            Name: <span id="my-name">${myName}</span> <br/>
            Occupation: <span id="my-occupation">${myOccupation}</span> <br/>
            Bio: <span id="my-bio">${myBio}</span> <br/>
            <button id="set-profile-button" class="align-center" onclick="setProfile()">Set Profile</button>`
        document.querySelector('#profile-content').innerHTML = profileContent
    })
}

function saveSetProfile(name, occupation, bio) {
    contractInstance.setProfile(name, occupation, bio, (err, result) => {
        console.log(err, result)
    })
}

function cancelSetProfile() {
    start()
}

function initDummyPeopleToFollow() {
    let users = [
        {
            name: "John",
            occupation: "Web App Developer",
            bio: "Suspendisse tempus, felis non convallis elementum, lectus urna eleifend augue, quis tristique felis ante sit amet elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
            isFollowing: false
        }, {
            name: "Jessica",
            occupation: "Graphic Designer",
            bio: "Quisque sapien mauris, rhoncus quis odio sed, ultrices molestie massa. Sed eu lorem quis velit egestas lobortis. In aliquam mauris eros, id varius turpis sagittis et.",
            isFollowing: true
        }, {
            name: "Veronica",
            occupation: "Blockchain Developer",
            bio: "Aenean egestas at tellus tempor faucibus. Morbi mattis metus in ex malesuada, faucibus eleifend ante interdum.",
            isFollowing: false
        }, {
            name: "Randy",
            occupation: "Youtuber",
            bio: "Phasellus nibh massa, sagittis nec odio sit amet, porttitor vestibulum urna. Nam lorem justo, pretium et nisl ac, ullamcorper tempus leo.",
            isFollowing: false
        }, {
            name: "Rick",
            occupation: "Backend Developer",
            bio: "Curabitur eros ante, tempor sit amet sagittis ac, tincidunt quis quam. Aenean vitae diam sodales, maximus dolor at, posuere odio. Phasellus id tortor faucibus, sagittis leo a, egestas metus.",
            isFollowing: true
        }
    ]
    localStorage.users = JSON.stringify(users)
}

function initPeopleFollow() {
    if(localStorage.users === undefined) initDummyPeopleToFollow()

    let users = JSON.parse(localStorage.users)
    let sectionContent = ''
    for(let i = 0; i < users.length; i++) {
        sectionContent += `<div id="people-to-follow-${i}" class="user-box">
            Name: <span>${users[i].name}</span> <br/>
            Occupation: <span>${users[i].occupation}</span> <br/>
            Bio: <span>${users[i].bio}</span> <br/>
            ${users[i].isFollowing ? `<button class="following-button" onclick="unfollowUser(${i})">Following</button>` : `<button onclick="followUser(${i})">Follow</button>`}
        </div>`
    }
    document.querySelector('#people-to-follow').innerHTML = sectionContent
}

function unfollowUser(id) {
    let users = JSON.parse(localStorage.users)
    users[id].isFollowing = false
    localStorage.users = JSON.stringify(users)
    initPeopleFollow()
}

function followUser(id) {
    let users = JSON.parse(localStorage.users)
    users[id].isFollowing = true
    localStorage.users = JSON.stringify(users)
    initPeopleFollow()
}

function sendMessage(message) {
    let messages = JSON.parse(localStorage.messages)
    messages.push({
        writtenBy: myName,
        content: message
    })
    localStorage.messages = JSON.stringify(messages)
    initMessages()
}

function initMessages() {
    if(localStorage.messages === undefined) initDummyMessages()

    let messages = JSON.parse(localStorage.messages)
    let sectionContent = ''
    for(let i = 0; i < messages.length; i++) {
        sectionContent += `<div class="message-box">
            <div>${messages[i].writtenBy} says:</div>
            <div>${messages[i].content}</div>
        </div>`
    }
    document.querySelector('#messages').innerHTML = sectionContent

}

function initDummyMessages() {
    let messages = [
        {
            content: "Proin tortor erat, sodales id bibendum at, semper at nibh. Quisque eu mattis enim. Donec dictum dui massa, non placerat lorem interdum eu.",
            writtenBy: "Jessica"
        }, {
            content: "Integer porttitor vel magna in sagittis. Integer suscipit tristique scelerisque. Sed condimentum sit amet mi a rhoncus.",
            writtenBy: "Veronica"
        }, {
            content: "In hac habitasse platea dictumst. Curabitur et nunc ultrices, interdum ligula nec, dignissim augue. Praesent varius nunc enim, ac efficitur augue hendrerit et.",
            writtenBy: "Rick"
        }, {
            content: "Mauris aliquet odio libero, vel aliquet est aliquam a. Duis vitae urna vitae massa ultrices tempor. Curabitur lacus massa, congue quis sagittis eu, consectetur non nisi. Proin id quam felis.",
            writtenBy: "Jessica"
        }, {
            content: "Curabitur dapibus est luctus, suscipit libero vel, euismod ex. Suspendisse id purus eu urna finibus rutrum.",
            writtenBy: "John"
        }
    ]
    localStorage.messages = JSON.stringify(messages)
}

function initDummyProfile() {
    localStorage.myProfile = JSON.stringify({
        name: "Anonymous",
        occupation: "Beep",
        bio: "I'm just a bot"
    })
    initMyProfile()
}

start()
