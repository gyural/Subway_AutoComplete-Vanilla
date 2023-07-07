// 노드와 트라이 자료구조 구현!!!
class Node {
    constructor(value="") {
        this.value = value;
        this.children = new Map();
        this.isEnd = false;
    }
}

class Trie {
    constructor(){
        this.root = new Node();
    }
    insert(string){
        let currentNode = this.root;
        for(const char of string){
            if(!currentNode.children.has(char)){
                currentNode.children.set(
                    char,
                    new Node(currentNode.value + char)
                );
            }
            currentNode = currentNode.children.get(char);
        }
        currentNode.isEnd = true;

    }
}

// Open API를 통해서 서울 수도권 역이름 가져오기!!! 
// (아직 미완이고 아래 코드까지 작동할 수 있어야함!!!)
 
// const station_name = trainData.map((station) => station.station_nm);
// 가상데이터로 역이름 배열 만들어주기
const stations = JSON.parse(JSON.stringify(Station))
const station_name = stations.DATA.map(station=>station.station_nm);
const trie = new Trie();
station_name.forEach((station) => {
  trie.insert(station);
});

const inputBox = document.querySelector('.inputBox');
const keywords = document.querySelector('.keywords');



// 큐 자료구조 구현
class Queue {
    constructor(){
        this.queue = [];
        this.front = 0;
        this.rear = 0;
        this.size = 0;
    }
    enqueue(node){
        this.size += 1;
        this.queue[this.rear++] = node;
    }
    dequeue(){
        const value = this.queue[this.front];
        delete this.queue[this.front];
        this.front += 1;
        this.size -= 1;
        return value;
    }
}
// 자동완성 클래스및 메서드 구현
class AutoComplete {
    constructor(trie){
        this.root = trie.root;
        this.wordlist = [];
    }
    print(string){
// 1. string에 대응되는 current Node 정해주기
        this.wordlist =[];
        const queue = new Queue();
        let currentNode = this.root;
        for (const char of string){
            if(currentNode.children.has(char)){
                currentNode = currentNode.children.get(char);
                
            }
        }
//2. current Node와 그의 모든 자식을 큐에 삽입
        // 해당되는 currentNode가 없다면 리턴
        if (currentNode.value.length == 0){
            return;
        }
        // 해당되는 currentNode보다 string의 길이가길다면 리턴
        if (string.length > currentNode.value.length){
            return;
        }
        if (currentNode.children && currentNode.children.size === 0){
            this.wordlist.push(currentNode.value);
            return this.wordlist            
        }
        if (currentNode.isEnd === true){
            this.wordlist.push(currentNode.value);
        }
        currentNode.children.forEach((node)=> {
            queue.enqueue(node);
        })
// 큐에 저장되어있는 녀석들을 종단노드이면 wordlist에 push
        while(queue.size){
            currentNode = queue.dequeue();
            // 종단 노드라면 wordlist에 push
            if(currentNode.isEnd === true){
                this.wordlist.push(currentNode.value);
                if (currentNode.children && currentNode.children.size != 0 ){
                    // 종단 노드이면서 자식노드를 가지고 있다면 자식노드들 큐에 푸쉬
                    currentNode.children.forEach((node)=> {
                        queue.enqueue(node);
                    })
                }
            }
            else {
                currentNode.children.forEach((node)=> {
                    queue.enqueue(node);
                })
            }
        }
        return this.wordlist;
    }
}


// 메서드를 이용해서 DOM으로 띄우기

// fillHTML함수 
const fillHTML = (arr) => {
    keywords.textContent="";
    const $ul = document.querySelector('ul');
    if (!arr){
      return
    }
    $ul.innerHTML =
      `
 ${arr && arr.map(el => 
     `<li class='word-element'>${el}역</li>`
    ).join('')}`
 }

 // loadAutoFill함수
const loadAutoFill = (input) => {
    const arr = autoComplete.print(input)
    if (arr && arr.length > 60){
          keywords.textContent="찾는 역이 없습니다."
          return;
        }
      fillHTML(arr);
    }

const checkInput = () => {
        const inputvalue = inputBox.value;
        if (inputvalue === "") {
            keywords.textContent="";
            return;
        }
        loadAutoFill(inputvalue);
}




//inputBox가 input이벤트 발생시 checkInput핸들러 디바운싱작동!!
const autoComplete = new AutoComplete(trie);
let timerId;
inputBox.addEventListener('input', function() {
  clearTimeout(timerId); // 이전 타이머를 제거하여 중복 실행 방지
  timerId = setTimeout(function() {
    checkInput();
  }, 300); // 500ms(0.5초) 후에 실행
});