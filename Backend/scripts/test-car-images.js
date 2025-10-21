// Test script to verify CarsXE API connection
const fetch = require('node-fetch');

async function testCarImages() {
  console.log('🧪 Testing CarsXE API connection...\n');
  
  const apiKey = process.env.CARSXE_API_KEY || 'YOUR_CARSXE_API_KEY';
  
  if (apiKey === 'YOUR_CARSXE_API_KEY') {
    console.log('❌ No API key found. Please add CARSXE_API_KEY to your .env file');
    console.log('   Get your free API key at: https://api.carsxe.com/');
    return;
  }
  
  // Test with BMW X5
  try {
    console.log('🔄 Testing BMW X5 2023...');
    const response = await fetch(
      `https://api.carsxe.com/images?key=${apiKey}&make=BMW&model=X5&year=2023&format=json`
    );
    
    const data = await response.json();
    
    if (data.success && data.images && data.images.length > 0) {
      console.log(`✅ Success! Found ${data.images.length} images for BMW X5 2023`);
      console.log(`   First image: ${data.images[0].link}`);
      console.log(`   Image dimensions: ${data.images[0].width}x${data.images[0].height}`);
    } else {
      console.log('❌ No images found for BMW X5 2023');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
  
  // Test with Tesla Model 3
  try {
    console.log('\n🔄 Testing Tesla Model 3 2024...');
    const response = await fetch(
      `https://api.carsxe.com/images?key=${apiKey}&make=Tesla&model=Model 3&year=2024&format=json`
    );
    
    const data = await response.json();
    
    if (data.success && data.images && data.images.length > 0) {
      console.log(`✅ Success! Found ${data.images.length} images for Tesla Model 3 2024`);
      console.log(`   First image: ${data.images[0].link}`);
    } else {
      console.log('❌ No images found for Tesla Model 3 2024');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
  
  // Test with Porsche 911
  try {
    console.log('\n🔄 Testing Porsche 911 2024...');
    const response = await fetch(
      `https://api.carsxe.com/images?key=${apiKey}&make=Porsche&model=911&year=2024&format=json`
    );
    
    const data = await response.json();
    
    if (data.success && data.images && data.images.length > 0) {
      console.log(`✅ Success! Found ${data.images.length} images for Porsche 911 2024`);
      console.log(`   First image: ${data.images[0].link}`);
    } else {
      console.log('❌ No images found for Porsche 911 2024');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
  
  console.log('\n🎉 API test completed!');
  console.log('If you see success messages above, your API key is working correctly.');
  console.log('You can now run the seed script to get proper car images.');
}

testCarImages();
