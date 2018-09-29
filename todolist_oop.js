/* 할일을 추가할 수 있다. 
할일이 추가되면 id값을 생성하고 결과를 알려준다. 
상태를 3가지로 관리된다. todo, doing, done
각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다. 
각 상태에 있는 task는 show 함수를 통해서 볼 수 있다. 
명령어를 입력 시 command 함수를 사용해야 하고, '$'를 구분자로 사용해서 넣는다. 
done의 경우 소요시간이 함께 표시된다. (소요시간은 doing 에서 done까지의 시간이다.)
구분자($)사이에 공백이 있다면 공백을 제거하고 실행되도록 한다. 
대/소문자 입력은 프로그램에서 소문자만 처리하도록 코드를 구현한다. 
유효하지 않은 입력은 오류를 발생시킨다. 
code 형태는 function으로 개발하고, 함수형의 특징을 많이 살리도록 노력한다.
*/
const {performance} = require('perf_hooks')

const Utils = class{
    constructor(){
        this.printUtil = new PrintUtils()
    }
    genWorkObj(strComm, workList){
        const workObj = {
            id: workList.length+1,
            status: this.getStatus(strComm[0]),
            workContents: strComm[1],
            workingTime: null
        }
        workList.push(workObj)
        return workList
    }
    getStatus(strStatus){
        let status = 0
        if(strStatus.indexOf('doing') != -1) status = 1
        else if(strStatus.indexOf('done') != -1) status = 2
        return status
    }
    commandParse(str){
        const parseStr = str.replace(/ /gi, "").toLowerCase().split("$")
        return parseStr
    }
    getSelectedStatusTaskList(strComm, workList){
        const status = this.getStatus(strComm[1])
        const selectedStatusTaskList = workList.filter(work => work.status == status)
        return selectedStatusTaskList
    }
    getCurrentWorkListStatus(workList){
        let workListStatus = [0, 0, 0]
        let currentWorkListStatus = workList.map(function(work){
            workListStatus[work.status]++
            return workListStatus
        })  
        return currentWorkListStatus 
    }
    checkWorkTime(updateIdx, updateStatus, workList){
        if(updateStatus.indexOf('doing') != -1){
            workList[updateIdx].workingTime = performance.now()
            return workList
        } else if(updateStatus.indexOf('done') != -1) return workList = this.updateTime(updateIdx, workList)
    }
    updateTime(updateIdx, workList){
        const currentTime = performance.now()
        const timeStamp = currentTime - workList[updateIdx].workingTime
        const convertToTime = Math.floor(timeStamp/(1000*60*60))+"시 "+Math.trunc(timeStamp/(1000*60))+"분 "+Math.trunc(timeStamp/1000)+"초"
        workList[updateIdx].workingTime = convertToTime
        return workList
    }
    updateTask(strComm, workList){
        const updateIdx = strComm[1]-1
        const updateStatus = strComm[2]
        workList[updateIdx].status = this.getStatus(updateStatus)
        workList = this.checkWorkTime(updateIdx, updateStatus, workList)
        this.printUtil.printCurrentStatus(this.getCurrentWorkListStatus(workList))
        if(updateStatus.indexOf('done') != -1) this.printUtil.printWorkingTime(workList[updateIdx], updateIdx)
    } 
    addTask(strComm, workList){
        this.printUtil.printAddTask(this.genWorkObj(strComm, workList))
        this.printUtil.printCurrentStatus(this.getCurrentWorkListStatus(workList))
    }
    showTask(strComm, workList){
        this.printUtil.printShowTaskStatus(this.getSelectedStatusTaskList(strComm, workList))
    }
}
const PrintUtils = class {
    constructor(){}
    printAddTask(workList){
        const id = workList.length
        console.log("id: " + id + ", " + workList[id-1].workContents + " 항목이 새로 추가됐습니다.")
    }
    printCurrentStatus(currentStatus){
        console.log("현재상태 : todo: " + currentStatus[0][0] + "개, doing: " + currentStatus[0][1] + "개, done: " + currentStatus[0][2] +"개")
    }
    printShowTaskStatus(selectedTaskList){
        if(selectedTaskList.length === 0) return console.log("없음")
        for(let selectedTask of selectedTaskList)
            console.log("\'"+ selectedTask.id + ", " + selectedTask.workContents + "\'")
    }
    printWorkingTime(workObj, updateIdx){
        console.log("id: "+ parseInt(updateIdx+1) +" 의 수행시간은 " + workObj.workingTime)
    }
}
const TodoList = class {
    constructor(){
        this.workList = [];
        this.util = new Utils()
        
    }   
    command(str){
        const strComm = this.util.commandParse(str)
        const doComm = strComm[0] 

        if(doComm.indexOf('add') != -1) this.util.addTask(strComm, this.workList)
        else if(doComm.indexOf('update') != -1) this.util.updateTask(strComm, this.workList)
        else if(doComm === 'show') this.util.showTask(strComm, this.workList)
       // else showErroMsg();
    }
}

const todo = new TodoList()
todo.command("add $ test ! ")
todo.command("add $ ageintest")
todo.command("update $ 1$ doing")
todo.command("update $ 1$ done")
todo.command("show$ todo")