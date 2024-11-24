import React, { useEffect, useState } from "react";
import "./SmallStatistic.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PROGRESSTASKSTATUSENUM,
  TASKPRIORITY,
} from "../../../../constants/enum";
import { PieChart } from "@mui/x-charts/PieChart";
import { Table } from "antd";
import { IMAGES } from "../../../../constants/images";

function TruncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

function SmallStatistic(props) {
  const { progress } = props;

  const { date, tasks, percent } = progress;

  const columns = [
    {
      title: "Công việc",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return TruncateText(text, 31);
      },
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (text) => {
        // Tìm màu sắc dựa trên độ ưu tiên
        const priorityInfo = TASKPRIORITY.find((item) => item.value === text);
        return (
          <div
            style={{
              backgroundColor: priorityInfo?.color,
              textAlign: "center",
              padding: "10px",
              fontWeight: "bold",
            }}
          >
            {priorityInfo ? priorityInfo.label : text}
          </div>
        );
      },
    },
  ];

  const [chartData, setChartData] = useState([]);
  const [isExistData, setIsExistData] = useState(false);

  useEffect(() => {
    const newChartData = [];

    for (let key in percent) {
      if (percent.hasOwnProperty(key)) {
        newChartData.push({
          type: PROGRESSTASKSTATUSENUM[key],
          value: percent[key],
          label: PROGRESSTASKSTATUSENUM[key],
        });
      }
      if (percent[key] > 0) {
        setIsExistData(true);
      }
    }

    setChartData(newChartData);
  }, [percent]);

  const paginationConfig = {
    pageSize: 3,
  };

  return (
    <div className="small-statistic-container d-flex justify-content-between row">
      <div className="small-statistic-chart-container col-6">
        <p className="small-statistic-chart-title">{date}</p>
        {chartData.length > 0 && isExistData && (
          <PieChart
            key={JSON.stringify(chartData)}
            series={[
              {
                data: chartData,
              },
            ]}
            height={300}
          />
        )}
        {!isExistData && (
          // <img alt='no data' className="small-statistic-no-data" src={IMAGES.no_data}/>
          <p className="small-statistic-no-data-text">Không có việc hôm nay</p>
        )}
      </div>
      <div className="small-statistic-tasks-container col-6">
        <h4 className="small-statistic-tasks-title">
          Danh sách công việc chưa hoàn thành
        </h4>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={paginationConfig}
        />
      </div>
    </div>
  );
}

export default SmallStatistic;
