// import React, { useEffect } from 'react'
// import { format } from 'date-fns'
// import Card from '../../Elements/Card'
//
// const PirepChart = ({ data }) => {
//   const altitude = []
//   const speed = []
//   const labels = []
//   let chartData = null
//   useEffect(() => {
//     data.map((log) => (
//       altitude.push(parseFloat(log.altitude))
//     ))
//
//     data.map((log) => (
//       speed.push(parseFloat(log.indicated_speed))
//     ))
//
//     data.map((log) => (
//       labels.push(format(new Date(log.created_at), 'HH:mm'))
//     ))
//
//     chartData = {
//       labels: labels,
//       datasets: [
//         {
//           label: 'Altitude',
//           data: altitude,
//           fill: true,
//           backgroundColor: 'rgba(249, 115, 22, 0.7)',
//           borderColor: 'rgba(249, 115, 22, 0.4)',
//           yAxisID: 'y-axis-1'
//         },
//         {
//           label: 'Indicated speed',
//           data: speed,
//           fill: true,
//           backgroundColor: 'rgba(22,163,74, 0.6)',
//           borderColor: 'rgba(22,163,74.4)',
//           yAxisID: 'y-axis-2'
//         }
//       ]
//     }
//   }, [])
//   return (
//     <Card title="Flight Data">
//       <Line data={chartData} />
//     </Card>
//   )
// }
//
// export default PirepChart
