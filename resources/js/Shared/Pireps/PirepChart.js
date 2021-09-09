import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'

const PirepChart = (props) => {
  const altitude = []
  props.data.map((log) => (
    altitude.push(parseFloat(log.altitude))
  ))

  const gs = []
  props.data.map((log) => (
    gs.push(parseFloat(log.ground_speed))
  ))

  const labels = []
  props.data.map((log) => (
    labels.push(format(new Date(log.created_at), 'HH:mm'))
  ))

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Altitude',
        data: altitude,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1'
      },
      {
        label: 'Ground speed',
        data: gs,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y-axis-2'
      }
    ]
  }

  // useEffect(() => {
  //   // if (chart.current) return
  //   chart.current = new Chart(chartContainer.current, {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         label: 'My First Dataset',
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //         backgroundColor: 'rgb(75, 192, 192)',
  //       }]
  //     }
  //   })
  // })

  return (

    <Line data={data} />
  )
}

export default PirepChart
