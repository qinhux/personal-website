// const HeapMap = require('heatmap.js');
// import heatmap from 'heatmap.js';

const accessToken = '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'; //怎样只选取必要的权限
const apiUrl = 'https://api.github.com/graphql';

//query的GraphQL查询的字符串一开始是怎么找到的？
const query = ` 
  query {
    viewer {
      contributionsCollection(from: "2024-01-01T00:00:00Z", to: "2025-01-01T00:00:00Z") {
        contributionCalendar {
          
          weeks {
            contributionDays {
              color
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

//fetch是怎么使用的。是用于发起网络请求的现代JavaScript API
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',     //不太清楚本行和下一行的用法
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ query })
}) //fetch返回一个Promise对象，你可以使用.then()和.catch()来处理异步操作。
    //在这里，我们通过.json()方法解析响应，并在then中处理数据。
  .then(response => response.json()) //then：用于处理 Promise 成功状态的回调函数。
  .then(data => {

    console.log(data);
    setCharData(data);
  })
  .catch(error => { //catch：用于处理 Promise 失败状态的回调函数。finally：无论 Promise 是成功还是失败，都会执行的回调函数。
    console.error('GraphQL request failed', error);
  });



function setCharData(data) {
const contributionData = data?.data?.viewer?.contributionsCollection?.contributionCalendar;

// console.log(contributionData);

if (contributionData) {
    const chartData = {
        labels: [],
        // datasets: [{
        data: [],
        backgroundColor: [],
        // }],
        dayInWeek: [],
    };

    contributionData.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
    chartData.labels.push(day.date);
    // chartData.datasets[0].data.push(day.contributionCount);
    chartData.data.push(day.contributionCount);
    // chartData.datasets[0].backgroundColor.push(day.color);
    chartData.backgroundColor.push(day.color);
    chartData.dayInWeek.push(day.weekday);
    });
    });

    
    let contributionGraphElem = document.getElementById("contributionGraph");

    //让每年的第一天在每周正确的位置。每列从周日开始显示
    console.log(chartData.dayInWeek[0]);
    for (let i = 0; i < chartData.dayInWeek[0]%7; i++) {
      let newElem = document.createElement("section")
      newElem.style.width = "15px";
      newElem.style.height = "15px";
      // newElem.style.backgroundColor = chartData.datasets[0].backgroundColor[i];
      newElem.style.backgroundColor = "white";
      newElem.style.margin = "5px";

      contributionGraphElem.appendChild(newElem);
    }


    //有闰年和平年的区别
    for (let i = 0; i < 366; i++) {
      let newElem = document.createElement("section")
      newElem.style.width = "15px";
      newElem.style.height = "15px";
      // newElem.style.backgroundColor = chartData.datasets[0].backgroundColor[i];
      newElem.style.backgroundColor = chartData.backgroundColor[i];
      newElem.style.margin = "5px";
      
      newElem.title = chartData.labels[i];

      contributionGraphElem.appendChild(newElem);
    }


    // Now you can use chartData for further processing
    } else {
    console.error("Error: Unable to retrieve contribution data from GraphQL response");
    }

}






