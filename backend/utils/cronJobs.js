import cron from "node-cron";
import Vehicle from "../models/Vehicle.js";
import SystemSettings from "../models/SystemSettings.js";

// WEEKLY QUOTA RESET - Runs every Sunday at 00:00 (12 AM UTC)
export const resetWeeklyQuota = () => {
    // Cron expression: At 00:00 on Sunday (0 0 * * 0)
    // Minute: 0
    // Hour: 0 (12 AM / midnight)
    // Day of month: * (any)
    // Month: * (any)
    // Day of week: 0 (Sunday)
    const cronExpression = "0 0 * * 0";
    
    console.log(`📅 Quota reset scheduler initialized (runs every Sunday at 00:00 UTC)`);
    
    cron.schedule(cronExpression, async () => {
        try {
            console.log(`⏰ [${new Date().toISOString()}] Starting weekly quota reset...`);
            
            let settings = await SystemSettings.findOne();
            
            // Create default settings if they don't exist
            if (!settings) {
                settings = await SystemSettings.create({
                    fuelQuotaByType: {
                        car: 50,
                        bike: 20,
                        van: 100,
                        bus: 150,
                        threewheel: 30
                    }
                });
                console.log("Created default system settings");
            }

            const vehicles = await Vehicle.find();
            let updatedCount = 0;

            for (let vehicle of vehicles) {
                const quota = settings.fuelQuotaByType[vehicle.vehicleType];
                vehicle.weeklyQuota = quota;
                vehicle.remainingQuota = quota;
                await vehicle.save();
                updatedCount++;
            }

            console.log(`✅ Weekly quotas reset successfully! Updated ${updatedCount} vehicles.`);
        } catch (error) {
            console.error(`❌ Error resetting quotas: ${error.message}`);
        }
    });
};