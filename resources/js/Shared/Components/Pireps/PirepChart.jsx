import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import Card from '../../Elements/Card'

const PirepChart = (props) => {
  const altitude = []
  props.data.map((log) => (
    altitude.push(parseFloat(log.altitude))
  ))

  const speed = []
  props.data.map((log) => (
    speed.push(parseFloat(log.indicated_speed))
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
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgba(249, 115, 22, 0.4)',
        yAxisID: 'y-axis-1'
      },
      {
        label: 'Indicated speed',
        data: speed,
        fill: true,
        backgroundColor: 'rgba(22,163,74, 0.6)',
        borderColor: 'rgba(22,163,74.4)',
        yAxisID: 'y-axis-2'
      }
    ]
  }
  return (
    <Card compact="true">
      <Line data={data} />
    </Card>
  )
}

export default PirepChart
